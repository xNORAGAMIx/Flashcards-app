import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flashcards: [],
};

const flashcardSlice = createSlice({
  name: "flashcard",
  initialState,
  reducers: {
    setFlashcards: (state, action) => {
      state.flashcards = action.payload;
    },
    clearFlashcards: (state) => {
      state.flashcards = [];
    },
  },
});

export const { setFlashcards, clearFlashcards } = flashcardSlice.actions;
export default flashcardSlice.reducer;
