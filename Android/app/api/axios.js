import axios from "axios";

const instance = axios.create({
  baseURL: "http://10.0.2.2:3000/api",
  withCredentials: true,
});
export default instance;
