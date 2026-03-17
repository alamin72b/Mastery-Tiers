import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface User {
  id?: number;
  name: string;
  email: string;
  picture: string; // Ensure this matches what you use in Header
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Define the shape of the Google JWT payload
interface GoogleJwtPayload {
  name: string;
  email: string;
  picture: string;
  sub: string; // Google's unique user ID
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      try {
        // 1. Decode the token
        const decoded = jwtDecode<GoogleJwtPayload>(token);

        // 2. Map Google data to your user state
        state.token = token;
        state.user = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };
        state.isAuthenticated = true;

        // Optional: Save to localStorage for persistence
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Failed to decode Google token:', error);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
