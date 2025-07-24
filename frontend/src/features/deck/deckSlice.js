import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  decks: [],
};

const deckSlice = createSlice({
  name: "deck",
  initialState,
  reducers: {
    setDecks: (state, action) => {
      state.decks = action.payload;
    },
    clearDecks: (state) => {
      state.decks = [];
    },
    addDeck: (state, action) => {
      const exists = state.decks.some(
        (deck) => deck._id === action.payload._id
      );
      if (!exists) {
        state.decks.push(action.payload);
      }
    },
  },
});

export const { setDecks, clearDecks, addDeck } = deckSlice.actions;
export default deckSlice.reducer;
