import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5002/api/decks",
});

// Done
export const create = (token, data) => {
  return API.post("/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Done
export const decks = (token) => {
  return API.get("/mine", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const shared = (data) => {
  return API.get("/shared", data);
};

// needs checking
export const update = (id, token, data) => {
  return API.put(`/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deckId = (id, token) => {
  return API.get(`/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const remove = (id, token) => {
  return API.delete(`/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
