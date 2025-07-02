import axios from "axios";

const API = axios.create({
  baseURL: "https://stats-service-asca.onrender.com/api/stats"
  // baseURL: "http://localhost:5005/api/stats",
});

export const dashboard = (token) => {
  return API.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
