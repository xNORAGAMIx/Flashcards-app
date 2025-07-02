import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5007/api/files",
});

// Done
export const fileImport = (token, data) => {
  return API.post("/import", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

