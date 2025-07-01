import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const login = (data) => {
  // console.log(data); -> correctly logs the data being sent
  return API.post("/login", data);
};

export const register = (data) => {
  return API.post("/register", data);
};
