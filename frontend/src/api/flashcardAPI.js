import axios from "axios";

const API = axios.create({
  baseURL: "https://flashcard-service-tv2x.onrender.com/api/flashcards"
  // baseURL: "http://localhost:5003/api/flashcards",
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
export const deckCards = (id,token) => {
  return API.get(`/deck/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// needs checking
export const update = (id, token, data) => {
  return API.put(`/${id}`, data, {
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
