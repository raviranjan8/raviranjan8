import http, {setHeader} from "../http-common";

export function authHeader() {
	const user = JSON.parse(localStorage.getItem('user'));
	if (user && user.accessToken) {
	  return { Authorization: 'Bearer ' + user.accessToken };
	} else {
	  return {};
	}
  }


const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  }
  
  const login = (data) => {
	return http.post("/auth/signin", data)
	  .then((response) => {
		if (response.data.accessToken) {
		  setHeader({ Authorization: 'Bearer ' + response.data.accessToken });
		  localStorage.setItem("user", JSON.stringify(response.data));
		}
		return response.data;
	  });
  };

  export function updateToken (token) {
	let user = JSON.parse(localStorage.getItem("user"));
	user.accessToken = token;
	localStorage.setItem("user", JSON.stringify(user));
  }
  export const refresh = (data, user) => {
	return http.post("/auth/refreshtoken", data, null)
	  .then((response) => {
		if (response.data.accessToken) {
		  user.accessToken = response.data.accessToken;
		  setHeader({ Authorization: 'Bearer ' + user.accessToken });
		  localStorage.setItem("user", JSON.stringify(user));
		}
		return response.data;
	  });
  };
  
  const logout = () => {
	localStorage.removeItem("user");
	setHeader(null);
  };

  const register = (data) => {
	return http.post("/auth/signup", data)
  };

const AuthService = {
	register,
	login,
	refresh,
	logout,
	updateToken,
	getCurrentUser,
  };
  
  export default AuthService;