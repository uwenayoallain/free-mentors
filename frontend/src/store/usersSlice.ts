import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { api } from "@/api/api";
import { ApiError, Mentor, Review, User, UserRole } from "@/api/types";
import { RootState } from "@/store";

interface UsersState {
  list: User[]; // Changed from users to list
  currentMentor: Mentor | null;
  reviews: Review[];
  isLoading: boolean;
  error: ApiError | null;
}

const initialState: UsersState = {
  list: [], // Changed from users to list
  currentMentor: null,
  reviews: [],
  isLoading: false,
  error: null,
};

// Fetch all users including mentors
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: ApiError }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  const response = await api.getUsers();

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

// Fetch mentors (specialized users)
export const fetchMentors = createAsyncThunk<
  User[],
  void,
  { rejectValue: ApiError }
>("users/fetchMentors", async (_, { rejectWithValue }) => {
  const response = await api.getMentors();

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

    dispatch(fetchMentors());
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
export const selectAllUsers = (state: RootState) => state.users.list;
export const selectMentors = createSelector(
  [selectAllUsers],
  (users) => users.filter((user) => user.role === UserRole.MENTOR) as Mentor[]
);
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
    // Fetch All Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload; // Changed from users to list
        state.isLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Failed to fetch users" };
      });

    // Fetch Mentors
    builder.addCase(fetchMentors.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMentors.fulfilled, (state, action) => {
      state.isLoading = false;
      // Update users array with mentors
      const mentors = action.payload.filter(
        (user) => user.role === UserRole.MENTOR
      );

      // Add mentors to users array if they don't exist
      mentors.forEach((mentor) => {
        const mentorExists = state.list.some((user) => user.id === mentor.id); // Changed from users to list
        if (!mentorExists) {
          state.list.push(mentor); // Changed from users to list
        } else {
          // Update existing mentor
          const index = state.list.findIndex((user) => user.id === mentor.id); // Changed from users to list
          if (index !== -1) {
            state.list[index] = mentor; // Changed from users to list
          }
        }
      });
    });
    builder.addCase(fetchMentors.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to fetch mentors" };
    });

    // Fetch Specific Mentor
    builder.addCase(fetchMentor.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMentor.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentMentor = action.payload;

      // Update user in the users array if exists
      const index = state.list.findIndex(
        (user) => user.id === action.payload.id
      ); // Changed from users to list
      if (index !== -1) {
        state.list[index] = action.payload; // Changed from users to list
      } else {
        state.list.push(action.payload); // Changed from users to list
      }
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
  },
});

export const { clearError, clearCurrentMentor } = usersSlice.actions;
export default usersSlice.reducer;
