import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import deckReducer from "../features/deck/deckSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// 1. Configure persistence -> auth persistence
const persistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "email",
    "token",
    "isAuthenticated",
    "username",
    "userId",
    "bio",
    "friends",
  ],
};

const persistConfigDeck = {
  key: "deck",
  storage,
  whitelist: ["decks"],
};

// 2. Create persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedDeckReducer = persistReducer(persistConfigDeck, deckReducer);

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// 3. Setup store with middleware config
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    deck: persistedDeckReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 4. Export persistor
export const persistor = persistStore(store);
