import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/api";
import { ApiError, Mentor, Review, User } from "@/api/types";
import { RootState } from "@/store";
import { logout } from "./authSlice";

interface UsersState {
  currentMentor: Mentor | null;
  reviews: Review[];
  isLoading: boolean;
  error: ApiError | null;
  allMentors: Mentor[];
  allUsers: User[];
}

const initialState: UsersState = {
  currentMentor: null,
  reviews: [],
  isLoading: false,
  error: null,
  allMentors: [],
  allUsers: [],
};

// Fetch current user
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>("users/fetchCurrentUser", async (_, { rejectWithValue }) => {
  const response = await api.getProfile();

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

// Fetch all mentors
export const fetchAllMentors = createAsyncThunk<
  Mentor[],
  void,
  { rejectValue: ApiError }
>("users/fetchAllMentors", async (_, { rejectWithValue }) => {
  const response = await api.getMentors();

  if (response.error) {
    return rejectWithValue(response.error);
  }
  return response.data!;
});

// Fetch all users
export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: ApiError }
>("users/fetchAllUsers", async (_, { rejectWithValue }) => {
  const response = await api.getUsers();

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

// Fetch specific mentor
export const fetchMentor = createAsyncThunk<
  Mentor,
  string,
  { rejectValue: ApiError }
>("users/fetchMentor", async (mentorId, { rejectWithValue }) => {
  const response = await api.getMentor(mentorId);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

// Fetch mentor reviews
export const fetchMentorReviews = createAsyncThunk<
  Review[],
  string,
  { rejectValue: ApiError }
>("users/fetchMentorReviews", async (mentorId, { rejectWithValue }) => {
  const response = await api.getReviews(mentorId);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

// Change mentor status
export const changeMentorStatus = createAsyncThunk<
  void,
  { userId: string; makeMentor: boolean },
  { rejectValue: ApiError }
>(
  "users/changeMentorStatus",
  async ({ userId, makeMentor }, { rejectWithValue, dispatch }) => {
    const response = await api.changeMentorStatus(userId, makeMentor);

    if (response.error) {
      return rejectWithValue(response.error);
    }

    dispatch(fetchCurrentUser()); // Refresh currentUser after status change
  }
);

// Hide review
export const hideReview = createAsyncThunk<
  Review,
  string,
  { rejectValue: ApiError }
>("users/hideReview", async (reviewId, { rejectWithValue }) => {
  const response = await api.hideReview(reviewId);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

// Selectors
export const selectAllMentors = (state: RootState) => state.users.allMentors;
export const selectAllUsers = (state: RootState) => state.users.allUsers;

export const selectCurrentMentor = (state: RootState) =>
  state.users.currentMentor;
export const selectReviews = (state: RootState) => state.users.reviews;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMentor: (state) => {
      state.currentMentor = null;
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          message: "Failed to fetch all users",
        };
      });

    // Fetch All Mentors
    builder
      .addCase(fetchAllMentors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllMentors.fulfilled, (state, action) => {
        state.allMentors = action.payload; // Update allMentors in state
        state.isLoading = false;
      })
      .addCase(fetchAllMentors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          message: "Failed to fetch all mentors",
        };
      });

    // Fetch Specific Mentor
    builder.addCase(fetchMentor.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMentor.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentMentor = action.payload;
    });
    builder.addCase(fetchMentor.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to fetch mentor" };
    });

    // Fetch Mentor Reviews
    builder.addCase(fetchMentorReviews.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMentorReviews.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviews = action.payload;
    });
    builder.addCase(fetchMentorReviews.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to fetch reviews" };
    });

    // Hide Review
    builder.addCase(hideReview.fulfilled, (state, action) => {
      state.reviews = state.reviews.filter(
        (review) => review.id !== action.payload.id
      );
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.currentMentor = null;
      state.reviews = [];
      state.allMentors = [];
      state.allUsers = [];
      state.error = null;
      state.isLoading = false;
    });
  },
});

export const { clearError, clearCurrentMentor } = usersSlice.actions;
export default usersSlice.reducer;
