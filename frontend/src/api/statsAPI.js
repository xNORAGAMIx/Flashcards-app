import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api/stats",
});

export const dashboard = (token) => {
  return API.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
