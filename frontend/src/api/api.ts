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
  UpdateUserInput,
} from "./types";

const endpoint = "http://localhost:8000/graphql/";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: () => {
    const token = localStorage.getItem("token"); // Or wherever you store the token
    return {
      ...(token && { authorization: `Bearer ${token}` }),
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
            userType
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
          token: "", // No Token returned from signup
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

  // createAdmin: async (
  //   input: CreateAdminInput
  // ): Promise<ApiResponse<AuthResponse>> => {
  //   const mutation = gql`
  //     mutation CreateAdmin(
  //       $firstName: String!
  //       $lastName: String!
  //       $email: String!
  //       $password: String!
  //       $address: String!
  //       $bio: String!
  //       $expertise: String!
  //     ) {
  //       createAdmin(
  //         firstName: $firstName
  //         lastName: $lastName
  //         email: $email
  //         password: $password
  //         address: $address
  //         bio: $bio
  //         expertise: $expertise
  //       ) {
  //         user {
  //           id
  //           email
  //           firstName
  //           lastName
  //           userType
  //           isStaff
  //         }
  //       }
  //     }
  //   `;

  //   try {
  //     interface CreateAdminResponse {
  //       createAdmin: {
  //         user: User;
  //       };
  //     }
  //     const data = await graphQLClient.request<CreateAdminResponse>(
  //       mutation,
  //       input
  //     );
  //     const user = data.createAdmin.user;
  //     return {
  //       data: {
  //         user: user,
  //         token: localStorage.getItem("token") || "",
  //       },
  //     };
  //   } catch (error) {
  //     return {
  //       error: {
  //         message: error instanceof Error ? error.message : String(error),
  //       },
  //     };
  //   }
  // },

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
      graphQLClient.setHeader("authorization", `Bearer ${tokenAuth.token}`);
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

  verifyToken: async (token: string): Promise<ApiResponse<boolean>> => {
    const mutation = gql`
      mutation VerifyToken($token: String!) {
        verifyToken(token: $token) {
          payload
        }
      }
    `;

    try {
      interface VerifyTokenResponse {
        verifyToken: {
          payload: Record<string, unknown>;
        };
      }
      const response = await graphQLClient.request<VerifyTokenResponse>(
        mutation,
        { token }
      );
      return { data: !!response.verifyToken.payload };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  refreshToken: async (token: string): Promise<ApiResponse<string>> => {
    const mutation = gql`
      mutation RefreshToken($token: String!) {
        refreshToken(token: $token) {
          token
          payload
        }
      }
    `;

    try {
      interface RefreshTokenResponse {
        refreshToken: {
          token: string;
          payload: Record<string, unknown>;
        };
      }
      const response = await graphQLClient.request<RefreshTokenResponse>(
        mutation,
        { token }
      );
      const newToken = response.refreshToken.token;
      localStorage.setItem("token", newToken);
      graphQLClient.setHeader("authorization", `Bearer ${newToken}`);
      return { data: newToken };
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

  // User endpoints
  updateUser: async (input: UpdateUserInput): Promise<ApiResponse<User>> => {
    const mutation = gql`
      mutation UpdateUser(
        $firstName: String
        $lastName: String
        $address: String
        $bio: String
        $occupation: String
        $expertise: String
      ) {
        updateUser(
          firstName: $firstName
          lastName: $lastName
          address: $address
          bio: $bio
          occupation: $occupation
          expertise: $expertise
        ) {
          user {
            id
            firstName
            lastName
            email
            bio
            address
            expertise
            occupation
            userType
          }
        }
      }
    `;

    try {
      interface UpdateUserResponse {
        updateUser: {
          user: User;
        };
      }
      const { updateUser } = await graphQLClient.request<UpdateUserResponse>(
        mutation,
        input
      );
      return { data: updateUser.user };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const query = gql`
      query {
        me {
          id
          firstName
          lastName
          email
          bio
          address
          expertise
          occupation
          isStaff
          password
          userType
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
          bio
          address
          expertise
          occupation
          isStaff
          password
          userType
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
          address
          occupation
          password
          userType
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
          address
          occupation
          isStaff
          password
          userType
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
            userType
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
      query MentorReviews($mentorId: String!) {
        mentorReviews(mentorId: $mentorId) {
          id
          session {
            id
            mentee {
              id
              firstName
              lastName
            }
            mentor {
              id
              firstName
              lastName
            }
          }
          rating
          content
          isVisible
          createdAt
          updatedAt
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

  getAllReviews: async (): Promise<ApiResponse<Review[]>> => {
    const query = gql`
      query {
        allReviews {
          content
          createdAt
          id
          isVisible
          rating
          session {
            id
            mentee {
              firstName
              lastName
              id
            }
            mentor {
              id
              firstName
              lastName
            }
          }
        }
      }
    `;
    try {
      interface AllReviewsResponse {
        allReviews: Review[];
      }
      const { allReviews } = await graphQLClient.request<AllReviewsResponse>(
        query
      );
      return { data: allReviews };
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
      mutation CreateReview(
        $sessionId: String!
        $rating: Int!
        $content: String!
      ) {
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
