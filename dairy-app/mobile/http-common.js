import axios from "axios";
import {getData, updateToken} from "./components/Storage";
//export const baseURL = "http://localhost:8080/";
//export const baseURL = "http://dairyweb-env.eba-rp2mcr7k.ap-south-1.elasticbeanstalk.com/";
//export const baseURL = "http://192.168.43.137:3000/";
export const baseURL= "http://dairy.ap-southeast-2.elasticbeanstalk.com/";

//export  const baseURL= "http://192.168.0.44:8080/";

export var header = null;
getHeader();

function getHeader () {
  const data = getData();
  data.then(user => {
    if (user && user.accessToken) {
      return header = user.accessToken ;
    } 
  });
}

export function setHeader (authHeader) {
  header = authHeader;
}

const instance = axios.create({
  baseURL: baseURL+'api', headers: {
    "Content-Type": "application/json",
  },
});


instance.interceptors.request.use(
  (config) => {
            if(null == header){
              getHeader ();
            }
            config.headers["Authorization"] = 'Bearer ' + header ;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && err.response.data 
                  && err.response.data.cause && err.response.data.cause.startsWith("JWT expired")) {
        try {
          const rs = await instance.post("/auth/refreshtoken", {
            refreshToken: header,
          });
          console.log(rs);
          const { accessToken } = rs.data;
          header = accessToken;
          updateToken(accessToken);
          return instance;
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance ;