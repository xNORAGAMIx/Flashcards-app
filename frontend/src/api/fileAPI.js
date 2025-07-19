import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_FILE_URL,
});

// Done
export const fileImport = (token, data) => {
  return API.post("/import", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

