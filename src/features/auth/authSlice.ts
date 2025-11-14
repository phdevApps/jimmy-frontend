import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authenticateCustomer, getUserProfile, updateCustomer, createCustomer, Customer } from '../../services/wooCommerceApi';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

// Updated login thunk for real authentication
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('loginUser: Attempting real authentication with email:', email);
      const response = await authenticateCustomer(email, password);
      console.log('loginUser: Real authentication successful');
      return response;
    } catch (error) {
      console.error('loginUser: Authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// New registration thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, firstName, lastName }: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
  }, { rejectWithValue }) => {
    try {
      console.log('registerUser: Creating new customer with email:', email);
      const customer = await createCustomer({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      
      // After creating customer, authenticate them
      const authResponse = await authenticateCustomer(email, password);
      console.log('registerUser: Registration and authentication successful');
      return authResponse;
    } catch (error) {
      console.error('registerUser: Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// Updated fetchUserProfile thunk to use JWT token
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (token: string, { rejectWithValue }) => {
    try {
      console.log('fetchUserProfile: Fetching profile with JWT token');
      const customer = await getUserProfile(token);
      console.log('fetchUserProfile: Profile fetched successfully');
      return customer;
    } catch (error) {
      console.error('fetchUserProfile: Failed to fetch profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, userData }: { userId: number; userData: Partial<Customer> }, { rejectWithValue }) => {
    try {
      console.log('updateUserProfile: Updating profile for user ID:', userId);
      const updatedCustomer = await updateCustomer(userId, userData);
      console.log('updateUserProfile: Profile updated successfully');
      return updatedCustomer;
    } catch (error) {
      console.error('updateUserProfile: Failed to update profile:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }
);

// Check for existing token and validate it
const getInitialToken = () => {
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined') {
    console.log('getInitialToken: Found existing token');
    return token;
  }
  console.log('getInitialToken: No valid token found');
  return null;
};

// Check for existing user data
const getInitialUser = () => {
  const userData = localStorage.getItem('userData');
  if (userData && userData !== 'null' && userData !== 'undefined') {
    try {
      const user = JSON.parse(userData);
      console.log('getInitialUser: Found existing user data:', user);
      return user;
    } catch (error) {
      console.error('getInitialUser: Failed to parse user data from localStorage:', error);
      localStorage.removeItem('userData');
    }
  }
  console.log('getInitialUser: No valid user data found');
  return null;
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!(initialToken && initialUser),
  isLoginModalOpen: false,
  isLoading: false,
  error: null,
};

console.log('authSlice: Initial state:', initialState);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      console.log('logout: Clearing user session');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('tokenTimestamp');
    },
    toggleLoginModal: (state) => {
      state.isLoginModalOpen = !state.isLoginModalOpen;
    },
    clearError: (state) => {
      state.error = null;
    },
    validateSession: (state) => {
      console.log('validateSession: Checking session validity');
      // Check if session is still valid
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData || token === 'null' || userData === 'null') {
        console.log('validateSession: Invalid session, clearing state');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      } else {
        console.log('validateSession: Session is valid');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { customer, token } = action.payload;
        state.user = {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          username: customer.username || customer.email,
          date_created: customer.date_created || new Date().toISOString(),
          billing: customer.billing,
          shipping: customer.shipping,
        };
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.isLoginModalOpen = false;
        state.error = null;
        
        // Persist to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(state.user));
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        console.log('loginUser.fulfilled: User logged in successfully');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
        console.log('loginUser.rejected: Login failed with error:', state.error);
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { customer, token } = action.payload;
        state.user = {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          username: customer.username,
          date_created: customer.date_created,
          billing: customer.billing,
          shipping: customer.shipping,
        };
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.isLoginModalOpen = false;
        state.error = null;
        
        // Persist to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(state.user));
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        console.log('registerUser.fulfilled: User registered and logged in successfully');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
        console.log('registerUser.rejected: Registration failed with error:', state.error);
      })
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        const customer = action.payload;
        state.user = {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          username: customer.username,
          date_created: customer.date_created,
          billing: customer.billing,
          shipping: customer.shipping,
        };
        state.isLoading = false;
        localStorage.setItem('userData', JSON.stringify(state.user));
        console.log('fetchUserProfile.fulfilled: Profile updated successfully');
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch profile';
        console.log('fetchUserProfile.rejected: Failed to fetch profile:', state.error);
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const customer = action.payload;
        state.user = {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          username: customer.username,
          date_created: customer.date_created,
          billing: customer.billing,
          shipping: customer.shipping,
        };
        state.isLoading = false;
        localStorage.setItem('userData', JSON.stringify(state.user));
        console.log('updateUserProfile.fulfilled: Profile updated successfully');
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to update profile';
        console.log('updateUserProfile.rejected: Failed to update profile:', state.error);
      });
  },
});

export const { 
  setLoading, 
  logout, 
  toggleLoginModal, 
  clearError,
  validateSession 
} = authSlice.actions;
export default authSlice.reducer;
