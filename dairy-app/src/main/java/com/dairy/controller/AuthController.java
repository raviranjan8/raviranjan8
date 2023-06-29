package com.dairy.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.dairy.model.ERole;
import com.dairy.model.Role;
import com.dairy.model.User;
import com.dairy.payload.request.LoginRequest;
import com.dairy.payload.request.SignupRequest;
import com.dairy.payload.request.TokenRefreshRequest;
import com.dairy.payload.response.JwtResponse;
import com.dairy.payload.response.MessageResponse;
import com.dairy.payload.response.TokenRefreshResponse;
import com.dairy.repository.RoleRepository;
import com.dairy.repository.UserRepository;
import com.dairy.security.jwt.JwtUtils;
import com.dairy.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;
  
  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }
  
  @PostMapping("/refreshtoken")
  public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
    String requestRefreshToken = request.getRefreshToken();
    return ResponseEntity.ok(new TokenRefreshResponse(
    		jwtUtils.generateTokenFromUsername(requestRefreshToken), request.getRefreshToken()));
  }

  /**
   * This method is used to generate OTP while first login or login after logout
   * This method will also be used for user update form user list page
   * @param signUpRequest
   * @return
   */
  @PostMapping("/signup")
  @Transactional
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
	  
	
	User user ;
	Optional<User> userOpt = userRepository.findByUsername(signUpRequest.getUsername());
    if (userOpt.isPresent()) {
    	user = userOpt.get();
      //return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
    }else {
    	user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), null);
    }
    
    //if userUpdate is false, then its signUp or relogin request.
    //otherwise, its just an user update
    if(!signUpRequest.getUserUpdate()) {
    	int randomPin   =(int)(Math.random()*9000)+1000;
    	String otp = String.valueOf(randomPin);
    	
    	user.setPassword(encoder.encode(otp));
    	RestTemplate restTemplate = new RestTemplate();
        String fooResourceUrl = "https://2factor.in/API/V1/8d263613-c338-11ec-9c12-0200cd936042/SMS/"+
        							signUpRequest.getUsername() + "/"+otp;
        ResponseEntity<String> response  = restTemplate.getForEntity(fooResourceUrl, String.class);
        System.out.println("Response>>>>>"+response.getStatusCode()+">>>"+otp);
    } 

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();
    //for the user update, all roles will be set from UI only.
    if(null != user.getRoles() && !signUpRequest.getUserUpdate()) {
    	roles.addAll(user.getRoles());
    }

    if (strRoles == null) {
      Role role = roleRepository.findByName(ERole.customer)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(role);
    } else {
      strRoles.forEach(role -> {
    	  if(role != null && !role.equals("")) {
	          Role adminRole = roleRepository.findByName(ERole.valueOf(role))
	              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
	          roles.add(adminRole);
    	  }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}
