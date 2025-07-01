import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  token: null,
  username: null,
  isAuthenticated: false,
  userId: null,
  bio: null,
  friends: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.email = null;
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
      state.userId = null;
      state.bio = null;
      state.friends = [];
    },
    setProfile: (state, action) => {
      state.userId = action.payload.userId;
      state.bio = action.payload.bio; 
      state.friends = action.payload.friends; 
    },
  },
});

export const { login, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;
