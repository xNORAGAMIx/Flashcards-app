import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_STUDY_URL,
});

export const review = (token, data) => {
  return API.post("/review", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const queue = (token) => {
  return API.get("/queue", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
