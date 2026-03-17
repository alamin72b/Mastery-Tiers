import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // You need this to read the Google data

interface User {
  id: number;
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  token: string | null;
  user: User | null; // This fixes the TS(2339) error
  isAuthenticated: boolean;
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
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Extract Google Info from the token
      try {
        const decoded: any = jwtDecode(action.payload.token);
        state.user = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name || 'User', // Google provides this
          picture: decoded.picture || '', // Google provides this
        };
      } catch (error) {
        console.error('Failed to decode token', error);
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
