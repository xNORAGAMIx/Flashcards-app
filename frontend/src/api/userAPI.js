import axios from "axios";

const API = axios.create({
  baseURL: "https://qzxj.shop/api/users",
});

export const profile = (token) => {
  return API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const update = (token, data) => {
  return API.put("/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const friend = (token, data) => {
  return API.post("/add-friend", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
