import axios from "axios";
import {authHeader, updateToken, refresh} from "./services/auth.service";

//export const baseURL = "http://192.168.0.44:8080/";
//export const baseURL = "http://dairyweb-env.eba-rp2mcr7k.ap-south-1.elasticbeanstalk.com/";
export const baseURL = "http://192.168.43.50:8080/";

const instance = axios.create({
  baseURL: baseURL+'api', headers: {
    "Content-Type": "application/json",
  }, 
});

export var header = authHeader() ;

export function setHeader (authHeader) {
  header = authHeader;
}

instance.interceptors.request.use(
  (config) => {
            config.headers = header ;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
instance.interceptors.response.use(
  undefined,
  (err) => {
    const originalConfig = err.config;
    if (err.response && err.response.status === 401 && err.response.data && !originalConfig._retry
                  && err.response.data.cause && err.response.data.cause.startsWith("JWT expired")) {
          originalConfig._retry = true;
          var data = {
            refreshToken: header
          }
          //const rs = await instance.post("/auth/refreshtoken", data);
          //console.log(rs);
          //const { accessToken } = rs.data;
          //header = { Authorization: 'Bearer ' + accessToken };
          /updateToken(accessToken);
          
          refresh(data).then(
            () => {
              console.log('token refresh.');
              return instance(originalConfig);
            },
            (error) => {
              console.log(error.response);
              return Promise.reject(err);
            }
          );
   }else {
      return Promise.reject(err);
   }
  }
);*/

export default instance ;