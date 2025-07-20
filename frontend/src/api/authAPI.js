import axios from "axios";

const API = axios.create({
  baseURL:  import.meta.env.VITE_API_AUTH_URL,
});

export const login = (data) => {
  // console.log(data); -> correctly logs the data being sent
  return API.post("/login", data);
};

export const register = (data) => {
  return API.post("/register", data);
};
