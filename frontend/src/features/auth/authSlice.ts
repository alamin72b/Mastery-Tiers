import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      try {
        const token = action.payload.token;
        const decoded: any = jwtDecode(token);

        // DEBUG: Check your browser console to see if Google is sending name/picture
        console.log('Google Data Decoded:', decoded);

        state.token = token;
        state.user = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture, // Google's standard field for profile image
        };
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('JWT Decode Error:', error);
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
