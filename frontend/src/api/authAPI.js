import axios from "axios";

const URL = "https://auth-service-n1ic.onrender.com"

const API = axios.create({
  baseURL: "https://auth-service-n1ic.onrender.com/api/auth",
  //baseURL: "http://localhost:5000/api/auth",
});

export const login = (data) => {
  // console.log(data); -> correctly logs the data being sent
  return API.post("/login", data);
};

export const register = (data) => {
  return API.post("/register", data);
};
