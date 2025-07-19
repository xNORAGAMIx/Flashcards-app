import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_USER_URL,
});

export const profile = (token) => {
  // console.log(data); -> correctly logs the data being sent
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
  console.log(data);

  return API.post("/add-friend", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
