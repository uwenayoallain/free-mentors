import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockApi } from "@/api/mockApi";
import { ApiError, LoginInput, SignupInput, User } from "@/api/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
}

const initialState: AuthState = {
  user: mockApi.getCurrentUser(),
  token: mockApi.getToken(),
  isAuthenticated: !!mockApi.getCurrentUser(),
  isLoading: false,
  error: null,
};

export const signup = createAsyncThunk<
  { user: User; token: string },
  SignupInput,
  { rejectValue: ApiError }
>("auth/signup", async (signupData, { rejectWithValue }) => {
  const response = await mockApi.signup(signupData);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return {
    user: response.data!.user,
    token: response.data!.token,
  };
});

export const login = createAsyncThunk<
  { user: User; token: string },
  LoginInput,
  { rejectValue: ApiError }
>("auth/login", async (loginData, { rejectWithValue }) => {
  const response = await mockApi.login(loginData);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return {
    user: response.data!.user,
    token: response.data!.token,
  };
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await mockApi.logout();
  return null;
});

export const getProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>("auth/getProfile", async (_, { rejectWithValue }) => {
  const response = await mockApi.getProfile();

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to sign up" };
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to login" };
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    });

    // Get Profile
    builder.addCase(getProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to get profile" };
    });
  },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;
