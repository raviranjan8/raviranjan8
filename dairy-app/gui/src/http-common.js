import axios from "axios";

export const baseURL = "http://localhost:8080/";
//export const baseURL = "http://dairyweb-env.eba-rp2mcr7k.ap-south-1.elasticbeanstalk.com/";
//export const baseURL = "http://192.168.43.137:3000/";

export default axios.create({
  baseURL: baseURL+'api',
});