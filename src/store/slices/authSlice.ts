import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/client';
import type { AuthUser } from '../../types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,          // start true so ProtectedRoute waits before redirecting
};

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me/');
    return res.data as AuthUser;    // { id, email, first_name, last_name, role }
  } catch {
    return rejectWithValue(null);   // cookies missing or expired
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout/');
  } catch {
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // checkAuth
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state) => {
      // clear state even if the API call fails (cookie may already be gone)
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
