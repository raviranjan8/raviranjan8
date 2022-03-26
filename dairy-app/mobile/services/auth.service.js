import http from "../http-common";

class AuthService {
   getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
  setCurrentUser(userName){
	  if(userName == 'Alok'){
		  var user = {
			  id: 'alok',
			  roles: ['ROLE_ADMIN','ROLE_MODERATOR']
		  };
		localStorage.setItem("user", JSON.stringify(user));
	  }
  }
}

export default new AuthService();
