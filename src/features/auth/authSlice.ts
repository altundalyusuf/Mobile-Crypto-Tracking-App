import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return rejectWithValue(error.message);
      }
      return {
        session: data.session,
        user: data.session?.user ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to check session"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return rejectWithValue(error.message);
      }
      return {
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to login"
      );
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        return rejectWithValue(error.message);
      }
      return {
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to sign up"
      );
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return rejectWithValue(error.message);
      }
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to sign out"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{ session: Session | null; user: User | null }>
    ) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.session;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.session;
        state.error = null;
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.session;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.session;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.session = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSession, clearError } = authSlice.actions;
export default authSlice.reducer;
