import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Coin } from "../../types/coin";

interface FavoritesState {
  favorites: Coin[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

const FAVORITES_STORAGE_KEY = "favorites";

export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        return favorites as Coin[];
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load favorites"
      );
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (coin: Coin, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { favorites: FavoritesState };
      const currentFavorites = state.favorites.favorites;
      const isFavorite = currentFavorites.some((fav) => fav.uuid === coin.uuid);

      let newFavorites: Coin[];
      if (isFavorite) {
        newFavorites = currentFavorites.filter((fav) => fav.uuid !== coin.uuid);
      } else {
        newFavorites = [...currentFavorites, coin];
      }

      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );

      return newFavorites;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to toggle favorite"
      );
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default favoritesSlice.reducer;
