import http from "../http-common";
import {setHeader} from "../http-common";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";

const parseJwt = (token) => {
	try {
	  return jwt_decode(token);
	} catch (e) {
	  return null;
	}
  };

  export const authVerify = async () => {
	try {
	  const jsonValue = await AsyncStorage.getItem('@user_Key');
	  var user = jsonValue != null ? JSON.parse(jsonValue) : null;
	  if (user && user.accessToken) {
		const decodedJwt = parseJwt(user.accessToken);
		if (decodedJwt && decodedJwt.exp && (decodedJwt.exp * 1000 < Date.now())) {
		  var param = {
			refreshToken : user.accessToken,
		  };
		  refresh(param, user);
		}
	  }
	  return user;
	} catch(e) {
	  console.log(e);
	}
  }

  const refresh = (data, user) => {
	return http.post("/auth/refreshtoken", data)
	  .then((response) => {
		if (response.data.accessToken) {
			setHeader(response.data.accessToken);
		  	user.accessToken = response.data.accessToken;
		  	AsyncStorage.setItem("@user_Key", JSON.stringify(user));
		}
		return response.data;
	  });
  };

const getCurrentUser = async () => {
	try {
	  const jsonValue = await AsyncStorage.getItem('@user_Key');
	  return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch(e) {
	  console.log(e);
	}
}
  
  const login = (data) => {
	return http.post("/auth/signin", data)
	  .then((response) => {
		if (response.data.accessToken) {
		  AsyncStorage.setItem("@user_Key", JSON.stringify(response.data));
		  setHeader(response.data.accessToken);
		}
		return response.data;
	  });
  };
  
  const logout = () => {
	AsyncStorage.removeItem("@user_Key");
	setHeader(null);
  };

  const register = (data) => {
	return http.post("/auth/signup", data)
  };

const AuthService = {
	register,
	login,
	logout,
	getCurrentUser,
  };
  
  export default AuthService;