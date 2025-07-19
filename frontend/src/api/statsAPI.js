import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_STATS_URL
});

export const dashboard = (token) => {
  return API.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
