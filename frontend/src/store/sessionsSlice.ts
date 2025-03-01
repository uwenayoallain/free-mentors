import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { mockApi } from "@/api/mockApi";
import {
  ApiError,
  Mentor,
  Review,
  ReviewInput,
  Session,
  SessionInput,
  SessionStatus,
  User,
} from "@/api/types";
import { RootState } from "@/store";

interface SessionsState {
  sessions: Session[];
  isLoading: boolean;
  error: ApiError | null;
  successMessage: string | null;
}

const initialState: SessionsState = {
  sessions: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

export const fetchSessions = createAsyncThunk<
  Session[],
  void,
  { rejectValue: ApiError }
>("sessions/fetchSessions", async (_, { rejectWithValue }) => {
  const response = await mockApi.getSessions();

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

export const createSession = createAsyncThunk<
  Session,
  SessionInput,
  { rejectValue: ApiError }
>("sessions/createSession", async (sessionData, { rejectWithValue }) => {
  const response = await mockApi.createSession(sessionData);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

export const updateSessionStatus = createAsyncThunk<
  Session,
  { sessionId: string; status: SessionStatus },
  { rejectValue: ApiError }
>(
  "sessions/updateSessionStatus",
  async ({ sessionId, status }, { rejectWithValue }) => {
    const response = await mockApi.updateSessionStatus(sessionId, status);

    if (response.error) {
      return rejectWithValue(response.error);
    }

    return response.data!;
  }
);

export const createReview = createAsyncThunk<
  Review,
  ReviewInput,
  { rejectValue: ApiError }
>("sessions/createReview", async (reviewData, { rejectWithValue }) => {
  const response = await mockApi.createReview(reviewData);

  if (response.error) {
    return rejectWithValue(response.error);
  }

  return response.data!;
});

// Create selectors
export const selectSessions = (state: RootState) => state.sessions.sessions;
export const selectUsers = (state: RootState) => state.users.list;
export const selectCurrentUser = (state: RootState) => state.auth.user;

// Compose selector for session details
export const getSessionWithDetails = createSelector(
  [selectSessions, selectUsers, selectCurrentUser],
  (sessions, users, currentUser) => {
    return sessions.map((session: Session) => {
      const mentor = users.find((user: User) => user.id === session.mentorId);
      const user = users.find((user: User) => user.id === session.userId);

      return {
        ...session,
        mentor: (mentor as Mentor) ?? null,
        user,
        isOwner: currentUser?.id === session.userId,
      };
    });
  }
);

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Sessions
    builder.addCase(fetchSessions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSessions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sessions = action.payload;
    });
    builder.addCase(fetchSessions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to fetch sessions" };
    });

    // Create Session
    builder.addCase(createSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sessions.push(action.payload);
      state.successMessage = "Mentorship session request sent successfully!";
    });
    builder.addCase(createSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to create session" };
    });

    // Update Session Status
    builder.addCase(updateSessionStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(updateSessionStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.sessions.findIndex(
        (session) => session.id === action.payload.id
      );
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }

      const statusText =
        action.payload.status === SessionStatus.ACCEPTED
          ? "accepted"
          : "declined";
      state.successMessage = `Session ${statusText} successfully!`;
    });
    builder.addCase(updateSessionStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || {
        message: "Failed to update session status",
      };
    });

    // Create Review
    builder.addCase(createReview.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createReview.fulfilled, (state) => {
      state.isLoading = false;
      state.successMessage = "Review submitted successfully!";
    });
    builder.addCase(createReview.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: "Failed to submit review" };
    });
  },
});

export const { clearSessionError, clearSuccessMessage } = sessionsSlice.actions;
export default sessionsSlice.reducer;
