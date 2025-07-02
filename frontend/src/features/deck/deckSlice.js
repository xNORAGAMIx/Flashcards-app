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
      state.decks.push(action.payload); 
    },
  },
});

export const { setDecks, clearDecks, addDeck } = deckSlice.actions;
export default deckSlice.reducer;
