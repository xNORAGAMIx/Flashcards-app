import axios from "axios";

const API = axios.create({
  baseURL: "https://study-service.onrender.com/api/study",
  // baseURL: "http://localhost:5004/api/study"
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
