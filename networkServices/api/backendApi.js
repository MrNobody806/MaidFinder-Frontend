import axios from "axios";

const instance = axios.create({
  // baseURL: "http://127.0.0.1:8000/api",
  baseURL: "http://192.168.43.217:8000/api",
  headers: {
    "content-type": "application/json",
    withCredentials: true,
  },
  // timeout: 10000,
});

export default instance;
