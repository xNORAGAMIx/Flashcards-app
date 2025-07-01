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
  },
});

export const { setDecks, clearDecks } = deckSlice.actions;
export default deckSlice.reducer;
