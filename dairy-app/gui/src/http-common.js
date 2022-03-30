import axios from "axios";

export default axios.create({
// baseURL: "http://dairyweb-env.eba-rp2mcr7k.ap-south-1.elasticbeanstalk.com/api",
  baseURL: "http://localhost:8080/api",
  //baseURL: "http://192.168.43.137:3000",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});