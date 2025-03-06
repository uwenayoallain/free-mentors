import { gql, GraphQLClient } from "graphql-request";
import {
  ApiResponse,
  AuthResponse,
  LoginInput,
  Mentor,
  Review,
  ReviewInput,
  Session,
  SessionInput,
  SessionStatus,
  SignupInput,
  User,
} from "./types";

const endpoint = "http://localhost:8000/graphql/";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: () => {
    const token = localStorage.getItem("token"); // Or wherever you store the token
    return {
      ...(token && { authorization: `JWT ${token}` }),
    };
  },
});

export const api = {
  // Auth endpoints
  signup: async (input: SignupInput): Promise<ApiResponse<AuthResponse>> => {
    const mutation = gql`
      mutation CreateUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $address: String!
        $bio: String
        $occupation: String
        $expertise: String
      ) {
        createUser(
          firstName: $firstName
          lastName: $lastName
          email: $email
          password: $password
          address: $address
          bio: $bio
          occupation: $occupation
          expertise: $expertise
        ) {
          user {
            id
            email
            firstName
            lastName
            role
          }
        }
      }
    `;

    try {
      interface CreateUserResponse {
        createUser: {
          user: User;
        };
      }
      const data = await graphQLClient.request<CreateUserResponse>(
        mutation,
        input
      );
      const user = data.createUser.user;
      return {
        data: {
          user: user,
          token: localStorage.getItem("token") || "", // If signup also returns token
        },
      };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
  login: async (input: LoginInput): Promise<ApiResponse<AuthResponse>> => {
    const mutation = gql`
      mutation TokenAuth($email: String!, $password: String!) {
        tokenAuth(email: $email, password: $password) {
          token
        }
      }
    `;

    try {
      interface TokenAuthResponse {
        tokenAuth: {
          token: string;
        };
      }
      const { tokenAuth } = await graphQLClient.request<TokenAuthResponse>(
        mutation,
        input
      );
      localStorage.setItem("token", tokenAuth.token); // Store the token
      graphQLClient.setHeader("authorization", `JWT ${tokenAuth.token}`); // set header for future requests
      const meResponse = await api.getProfile();
      if (meResponse.error || !meResponse.data) {
        return {
          error: meResponse.error || {
            message: "Failed to fetch user profile",
          },
        };
      }
      return {
        data: {
          token: tokenAuth.token,
          user: meResponse.data,
        },
      };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    localStorage.removeItem("token");
    graphQLClient.setHeader("authorization", "");
    return { data: undefined };
  },

  // Mentor endpoints
  getMentors: async (): Promise<ApiResponse<Mentor[]>> => {
    const query = gql`
      query {
        mentors {
          id
          firstName
          lastName
          email
          bio
          expertise
        }
      }
    `;

    try {
      interface MentorsResponse {
        mentors: Mentor[];
      }
      const { mentors } = await graphQLClient.request<MentorsResponse>(query);
      return { data: mentors };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  getMentor: async (id: string): Promise<ApiResponse<Mentor>> => {
    const query = gql`
      query Mentor($id: ID!) {
        mentor(id: $id) {
          id
          firstName
          lastName
          email
          bio
          expertise
          rating
          totalReviews
          yearsOfExperience
          availableDays
        }
      }
    `;

    try {
      interface MentorResponse {
        mentor: Mentor;
      }
      const { mentor } = await graphQLClient.request<MentorResponse>(query, {
        id,
      });
      return { data: mentor };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  // User endpoints
  getProfile: async (): Promise<ApiResponse<User>> => {
    const query = gql`
      query {
        me {
          id
          firstName
          lastName
          email
          role
          bio
        }
      }
    `;

    try {
      interface MeResponse {
        me: User;
      }
      const { me } = await graphQLClient.request<MeResponse>(query);
      return { data: me };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const query = gql`
      query {
        users {
          id
          firstName
          lastName
          email
          role
          bio
        }
      }
    `;

    try {
      interface UsersResponse {
        users: User[];
      }
      const { users } = await graphQLClient.request<UsersResponse>(query);
      return { data: users };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  // Admin endpoints
  changeMentorStatus: async (
    userId: string,
    makeMentor: boolean
  ): Promise<ApiResponse<User>> => {
    const mutation = gql`
      mutation ChangeToMentor($userId: ID!) {
        changeToMentor(userId: $userId) {
          user {
            id
            role
          }
        }
      }
    `;

    try {
      if (makeMentor) {
        interface ChangeToMentorResponse {
          changeToMentor: {
            user: User;
          };
        }
        const { changeToMentor } =
          await graphQLClient.request<ChangeToMentorResponse>(mutation, {
            userId,
          });
        return { data: changeToMentor.user };
      } else {
        return {
          error: {
            message:
              "converting from mentor to user is not implemented in the backend",
          },
        };
      }
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
  // Session endpoints
  getSessions: async (): Promise<ApiResponse<Session[]>> => {
    const query = gql`
      query {
        userSessions {
          id
          mentor {
            id
            firstName
            lastName
          }
          mentee {
            id
            firstName
            lastName
          }
          topic
          questions
          status
        }
      }
    `;

    try {
      interface UserSessionsResponse {
        userSessions: Session[];
      }
      const { userSessions } =
        await graphQLClient.request<UserSessionsResponse>(query);
      return { data: userSessions };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  createSession: async (input: SessionInput): Promise<ApiResponse<Session>> => {
    const mutation = gql`
      mutation CreateSession(
        $mentorId: ID!
        $topic: String!
        $questions: String!
      ) {
        createSession(
          mentorId: $mentorId
          topic: $topic
          questions: $questions
        ) {
          session {
            id
            mentor {
              id
              firstName
              lastName
            }
            mentee {
              id
              firstName
              lastName
            }
            topic
            questions
            status
          }
        }
      }
    `;

    try {
      interface CreateSessionResponse {
        createSession: {
          session: Session;
        };
      }
      const { createSession } =
        await graphQLClient.request<CreateSessionResponse>(mutation, input);
      return { data: createSession.session };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  updateSessionStatus: async (
    sessionId: string,
    status: SessionStatus
  ): Promise<ApiResponse<Session>> => {
    const mutation = gql`
      mutation UpdateSessionStatus($sessionId: ID!, $status: String!) {
        updateSessionStatus(sessionId: $sessionId, status: $status) {
          session {
            id
            mentor {
              id
              firstName
              lastName
            }
            mentee {
              id
              firstName
              lastName
            }
            topic
            questions
            status
          }
        }
      }
    `;

    try {
      interface UpdateSessionStatusResponse {
        updateSessionStatus: {
          session: Session;
        };
      }
      const { updateSessionStatus } =
        await graphQLClient.request<UpdateSessionStatusResponse>(mutation, {
          sessionId,
          status,
        });
      return { data: updateSessionStatus.session };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  // Review endpoints
  getReviews: async (mentorId: string): Promise<ApiResponse<Review[]>> => {
    const query = gql`
      query MentorReviews($mentorId: ID!) {
        mentorReviews(mentorId: $mentorId) {
          id
          session {
            id
          }
          rating
          content
        }
      }
    `;
    try {
      interface MentorReviewsResponse {
        mentorReviews: Review[];
      }
      const { mentorReviews } =
        await graphQLClient.request<MentorReviewsResponse>(query, {
          mentorId,
        });
      return { data: mentorReviews };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  createReview: async (input: ReviewInput): Promise<ApiResponse<Review>> => {
    const mutation = gql`
      mutation CreateReview($sessionId: ID!, $rating: Int!, $content: String!) {
        createReview(
          sessionId: $sessionId
          rating: $rating
          content: $content
        ) {
          review {
            id
            session {
              id
            }
            rating
            content
          }
        }
      }
    `;

    try {
      interface CreateReviewResponse {
        createReview: {
          review: Review;
        };
      }
      const { createReview } =
        await graphQLClient.request<CreateReviewResponse>(mutation, input);
      return { data: createReview.review };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  hideReview: async (reviewId: string): Promise<ApiResponse<Review>> => {
    const mutation = gql`
      mutation UpdateReviewVisibility($reviewId: ID!, $isVisible: Boolean!) {
        updateReviewVisibility(reviewId: $reviewId, isVisible: $isVisible) {
          review {
            id
            session {
              id
            }
            rating
            content
            isVisible
          }
        }
      }
    `;

    try {
      interface UpdateReviewVisibilityResponse {
        updateReviewVisibility: {
          review: Review;
        };
      }
      const { updateReviewVisibility } =
        await graphQLClient.request<UpdateReviewVisibilityResponse>(mutation, {
          reviewId,
          isVisible: false,
        });
      return { data: updateReviewVisibility.review };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
};
