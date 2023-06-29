package com.dairy.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dairy.model.User;
import com.dairy.repository.UserRepository;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class UserController {

	@Autowired
	UserRepository repository;

	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers(@ModelAttribute User param) {
		try {
			List<User> responseList = new ArrayList<User>();
			
			if(null != param) {
				repository.findAll(Example.of(param)).forEach(responseList::add);
			}else {
				repository.findAll().forEach(responseList::add);
			}
			if (responseList.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(responseList, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/users/{id}")
	public ResponseEntity<User> getById(@PathVariable("id") long id) {
		Optional<User> idData = repository.findById(id);

		if (idData.isPresent()) {
			return new ResponseEntity<>(idData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/users")
	public ResponseEntity<User> create(@RequestBody User createData) {
		try {
			User createdData = repository.save(createData);
			return new ResponseEntity<>(createdData, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/users/{id}")
	public ResponseEntity<User> update(@PathVariable("id") long id, @RequestBody User updateData) {
		try {
			User updatedData = repository.save(updateData);
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") long id) {
		try {
			repository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/users")
	public ResponseEntity<HttpStatus> deleteAll() {
		try {
			repository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
