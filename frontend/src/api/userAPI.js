import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:5001/api/users",
});

export const profile = (token) => {
  // console.log(data); -> correctly logs the data being sent
  return API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const update = (data) => {
  return API.put("/me", data);
};

export const friend = (data) => {
  return API.post("/add-friend", data);
};

