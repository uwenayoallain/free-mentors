import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockApi } from "../api/mockApi";
import { ApiError, Mentor, Review } from "../api/types";

interface MentorsState {
  mentors: Mentor[];
  currentMentor: Mentor | null;
  reviews: Review[];
  isLoading: boolean;
  error: ApiError | null;
}

const initialState: MentorsState = {
  mentors: [],
  currentMentor: null,
  reviews: [],
  isLoading: false,
  error: null,
};

export const fetchMentors = createAsyncThunk<
  Mentor[],
  void,
  { rejectValue: ApiError }
>("mentors/fetchMentors", async (_, { rejectWithValue }) => {
  const response = await mockApi.getMentors();

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

export const fetchMentor = createAsyncThunk<
  Mentor,
  string,
  { rejectValue: ApiError }
>("mentors/fetchMentor", async (mentorId, { rejectWithValue }) => {
  const response = await mockApi.getMentor(mentorId);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

export const fetchMentorReviews = createAsyncThunk<
  Review[],
  string,
  { rejectValue: ApiError }
>("mentors/fetchMentorReviews", async (mentorId, { rejectWithValue }) => {
  const response = await mockApi.getReviews(mentorId);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

export const changeMentorStatus = createAsyncThunk<
  void,
  { userId: string; makeMentor: boolean },
  { rejectValue: ApiError }
>(
  "mentors/changeMentorStatus",
  async ({ userId, makeMentor }, { rejectWithValue, dispatch }) => {
    const response = await mockApi.changeMentorStatus(userId, makeMentor);

    if (response.error) {
      return rejectWithValue(response.error);
    }

    dispatch(fetchMentors());
  },
);

export const hideReview = createAsyncThunk<
  Review,
  string,
  { rejectValue: ApiError }
>("mentors/hideReview", async (reviewId, { rejectWithValue }) => {
  const response = await mockApi.hideReview(reviewId);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

const mentorsSlice = createSlice({
  name: "mentors",
  initialState,
  reducers: {
    clearMentorError: (state) => {
      state.error = null;
    },
    clearCurrentMentor: (state) => {
      state.currentMentor = null;
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Mentors
    builder.addCase(fetchMentors.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMentors.fulfilled, (state, action) => {
      state.isLoading = false;
      state.mentors = action.payload;
    });
    builder.addCase(fetchMentors.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to fetch mentors" };
    });

    // Fetch Mentor
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
        (review) => review.id !== action.payload.id,
      );
    });
  },
});

export const { clearMentorError, clearCurrentMentor } = mentorsSlice.actions;
export default mentorsSlice.reducer;
