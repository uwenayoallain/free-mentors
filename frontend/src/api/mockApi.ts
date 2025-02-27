import { v4 as uuidv4 } from "uuid";
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
  UserRole,
} from "./types";

// Mock users data
const users: User[] = [
  {
    id: "1",
    email: "admin@freementors.com",
    firstName: "Admin",
    lastName: "User",
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "johndoe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: UserRole.USER,
    bio: "Regular user looking for mentorship",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock mentors data
const mentors: Mentor[] = [
  {
    id: "3",
    email: "sarah.johnson@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    role: UserRole.MENTOR,
    bio: "Experienced software developer with 10 years of industry experience. I specialize in web development and enjoy helping others grow in their careers.",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    expertise: ["React", "JavaScript", "Web Development"],
    rating: 4.8,
    totalReviews: 24,
    yearsOfExperience: 10,
    availableDays: ["Monday", "Wednesday", "Friday"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    email: "michael.brown@example.com",
    firstName: "Michael",
    lastName: "Brown",
    role: UserRole.MENTOR,
    bio: "Data Scientist with focus on ML and AI. I've worked with startups and large enterprises to implement data-driven solutions.",
    profilePicture: "https://i.pravatar.cc/150?img=3",
    expertise: ["Data Science", "Python", "Machine Learning"],
    rating: 4.9,
    totalReviews: 19,
    yearsOfExperience: 8,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    email: "emma.wilson@example.com",
    firstName: "Emma",
    lastName: "Wilson",
    role: UserRole.MENTOR,
    bio: "UX/UI Designer passionate about creating beautiful and intuitive user experiences. I can help with design thinking, user research, and portfolio reviews.",
    profilePicture: "https://i.pravatar.cc/150?img=9",
    expertise: ["UX Design", "UI Design", "Figma", "User Research"],
    rating: 4.7,
    totalReviews: 15,
    yearsOfExperience: 6,
    availableDays: ["Monday", "Tuesday", "Friday"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    email: "david.lee@example.com",
    firstName: "David",
    lastName: "Lee",
    role: UserRole.MENTOR,
    bio: "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines. I can help you with AWS, Docker, Kubernetes, and more.",
    profilePicture: "https://i.pravatar.cc/150?img=7",
    expertise: ["DevOps", "AWS", "Docker", "Kubernetes"],
    rating: 4.6,
    totalReviews: 12,
    yearsOfExperience: 7,
    availableDays: ["Wednesday", "Thursday", "Saturday"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    email: "lisa.taylor@example.com",
    firstName: "Lisa",
    lastName: "Taylor",
    role: UserRole.MENTOR,
    bio: "Software Engineering Manager with experience leading teams at top tech companies. I can provide career guidance and leadership advice.",
    profilePicture: "https://i.pravatar.cc/150?img=10",
    expertise: ["Leadership", "Career Development", "Engineering Management"],
    rating: 5.0,
    totalReviews: 21,
    yearsOfExperience: 12,
    availableDays: ["Monday", "Wednesday", "Friday"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock sessions data
const sessions: Session[] = [
  {
    id: "1",
    mentorId: "3",
    userId: "2",
    title: "Career Transition to Web Development",
    description:
      "I need guidance on transitioning from backend to frontend development",
    status: SessionStatus.ACCEPTED,
    scheduledDate: new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    mentorId: "4",
    userId: "2",
    title: "Help with Machine Learning Project",
    description:
      "I'm working on a personal ML project and need some advice on model selection",
    status: SessionStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock reviews data
const reviews: Review[] = [
  {
    id: "1",
    sessionId: "1",
    mentorId: "3",
    userId: "2",
    rating: 5,
    comment:
      "Sarah was extremely helpful and provided clear guidance on my career transition. Highly recommend!",
    isHidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock localStorage for auth state
const mockStorage = {
  token: null as string | null,
  user: null as User | null,
};

// Delay function to simulate network request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Auth endpoints
  signup: async (input: SignupInput): Promise<ApiResponse<AuthResponse>> => {
    await delay(500);

    const existingUser = users.find((user) => user.email === input.email);
    if (existingUser) {
      return {
        error: {
          message: "User with this email already exists",
          errors: {
            email: ["Email is already taken"],
          },
        },
      };
    }

    const newUser: User = {
      id: uuidv4(),
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = `mock-jwt-token-${newUser.id}`;
    mockStorage.token = token;
    mockStorage.user = newUser;

    return {
      data: {
        token,
        user: newUser,
      },
    };
  },

  login: async (input: LoginInput): Promise<ApiResponse<AuthResponse>> => {
    await delay(500);

    // In a mock environment, we'll accept any registered email with any password
    const user = users.find((user) => user.email === input.email);
    if (!user) {
      return {
        error: {
          message: "Invalid email or password",
        },
      };
    }

    const token = `mock-jwt-token-${user.id}`;
    mockStorage.token = token;
    mockStorage.user = user;

    return {
      data: {
        token,
        user,
      },
    };
  },

  logout: async (): Promise<ApiResponse<void>> => {
    await delay(200);
    mockStorage.token = null;
    mockStorage.user = null;

    return { data: undefined };
  },

  // Mentor endpoints
  getMentors: async (): Promise<ApiResponse<Mentor[]>> => {
    await delay(500);
    return { data: mentors };
  },

  getMentor: async (id: string): Promise<ApiResponse<Mentor>> => {
    await delay(300);
    const mentor = mentors.find((mentor) => mentor.id === id);

    if (!mentor) {
      return {
        error: {
          message: "Mentor not found",
        },
      };
    }

    return { data: mentor };
  },

  // User endpoints
  getProfile: async (): Promise<ApiResponse<User>> => {
    await delay(300);
    if (!mockStorage.user) {
      return {
        error: {
          message: "Unauthorized",
        },
      };
    }

    return { data: mockStorage.user };
  },

  // Admin endpoints
  changeMentorStatus: async (
    userId: string,
    makeMentor: boolean
  ): Promise<ApiResponse<User>> => {
    await delay(500);
    if (!mockStorage.user || mockStorage.user.role !== UserRole.ADMIN) {
      return {
        error: {
          message: "Unauthorized. Only admins can perform this action",
        },
      };
    }

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return {
        error: {
          message: "User not found",
        },
      };
    }

    if (makeMentor) {
      // Convert user to mentor
      const user = users[userIndex];
      const newMentor: Mentor = {
        ...user,
        role: UserRole.MENTOR,
        expertise: [],
        rating: 0,
        totalReviews: 0,
        yearsOfExperience: 0,
        availableDays: ["Monday", "Wednesday", "Friday"],
        updatedAt: new Date().toISOString(),
      };

      users[userIndex] = newMentor;
      mentors.push(newMentor);

      return { data: newMentor };
    } else {
      // Convert mentor to user
      const mentorIndex = mentors.findIndex((mentor) => mentor.id === userId);
      if (mentorIndex !== -1) {
        mentors.splice(mentorIndex, 1);
      }

      users[userIndex].role = UserRole.USER;
      users[userIndex].updatedAt = new Date().toISOString();

      return { data: users[userIndex] };
    }
  },

  // Session endpoints
  getSessions: async (): Promise<ApiResponse<Session[]>> => {
    await delay(400);
    if (!mockStorage.user) {
      return {
        error: {
          message: "Unauthorized",
        },
      };
    }

    let userSessions: Session[];
    if (mockStorage.user.role === UserRole.MENTOR) {
      userSessions = sessions.filter(
        (session) => session.mentorId === mockStorage.user?.id
      );
    } else {
      userSessions = sessions.filter(
        (session) => session.userId === mockStorage.user?.id
      );
    }

    return { data: userSessions };
  },

  createSession: async (input: SessionInput): Promise<ApiResponse<Session>> => {
    await delay(500);
    if (!mockStorage.user) {
      return {
        error: {
          message: "Unauthorized",
        },
      };
    }

    const mentor = mentors.find((mentor) => mentor.id === input.mentorId);
    if (!mentor) {
      return {
        error: {
          message: "Mentor not found",
        },
      };
    }

    const newSession: Session = {
      id: uuidv4(),
      mentorId: input.mentorId,
      userId: mockStorage.user.id,
      title: input.title,
      description: input.description,
      status: SessionStatus.PENDING,
      scheduledDate: input.scheduledDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessions.push(newSession);

    return { data: newSession };
  },

  updateSessionStatus: async (
    sessionId: string,
    status: SessionStatus
  ): Promise<ApiResponse<Session>> => {
    await delay(400);
    if (!mockStorage.user || mockStorage.user.role !== UserRole.MENTOR) {
      return {
        error: {
          message: "Unauthorized. Only mentors can update session status",
        },
      };
    }

    const sessionIndex = sessions.findIndex(
      (session) =>
        session.id === sessionId && session.mentorId === mockStorage.user?.id
    );

    if (sessionIndex === -1) {
      return {
        error: {
          message:
            "Session not found or you are not the mentor for this session",
        },
      };
    }

    sessions[sessionIndex].status = status;
    sessions[sessionIndex].updatedAt = new Date().toISOString();

    return { data: sessions[sessionIndex] };
  },

  // Review endpoints
  getReviews: async (mentorId: string): Promise<ApiResponse<Review[]>> => {
    await delay(300);
    const mentorReviews = reviews.filter(
      (review) => review.mentorId === mentorId && !review.isHidden
    );

    return { data: mentorReviews };
  },

  createReview: async (input: ReviewInput): Promise<ApiResponse<Review>> => {
    await delay(400);
    if (!mockStorage.user) {
      return {
        error: {
          message: "Unauthorized",
        },
      };
    }

    const session = sessions.find(
      (session) =>
        session.id === input.sessionId &&
        session.userId === mockStorage.user?.id
    );

    if (!session) {
      return {
        error: {
          message: "Session not found or you are not authorized to review it",
        },
      };
    }

    if (session.status !== SessionStatus.COMPLETED) {
      return {
        error: {
          message: "You can only review completed sessions",
        },
      };
    }

    const newReview: Review = {
      id: uuidv4(),
      sessionId: input.sessionId,
      mentorId: session.mentorId,
      userId: mockStorage.user.id,
      rating: input.rating,
      comment: input.comment,
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reviews.push(newReview);

    // Update mentor rating
    const mentorIndex = mentors.findIndex(
      (mentor) => mentor.id === session.mentorId
    );
    if (mentorIndex !== -1) {
      const mentorReviews = reviews.filter(
        (review) => review.mentorId === session.mentorId && !review.isHidden
      );
      const totalRating = mentorReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      mentors[mentorIndex].totalReviews = mentorReviews.length;
      mentors[mentorIndex].rating = parseFloat(
        (totalRating / mentorReviews.length).toFixed(1)
      );
    }

    return { data: newReview };
  },

  hideReview: async (reviewId: string): Promise<ApiResponse<Review>> => {
    await delay(400);
    if (!mockStorage.user || mockStorage.user.role !== UserRole.ADMIN) {
      return {
        error: {
          message: "Unauthorized. Only admins can hide reviews",
        },
      };
    }

    const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
    if (reviewIndex === -1) {
      return {
        error: {
          message: "Review not found",
        },
      };
    }

    reviews[reviewIndex].isHidden = true;
    reviews[reviewIndex].updatedAt = new Date().toISOString();

    // Update mentor rating
    const mentorId = reviews[reviewIndex].mentorId;
    const mentorIndex = mentors.findIndex((mentor) => mentor.id === mentorId);

    if (mentorIndex !== -1) {
      const mentorReviews = reviews.filter(
        (review) => review.mentorId === mentorId && !review.isHidden
      );

      if (mentorReviews.length === 0) {
        mentors[mentorIndex].rating = 0;
        mentors[mentorIndex].totalReviews = 0;
      } else {
        const totalRating = mentorReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        mentors[mentorIndex].totalReviews = mentorReviews.length;
        mentors[mentorIndex].rating = parseFloat(
          (totalRating / mentorReviews.length).toFixed(1)
        );
      }
    }

    return { data: reviews[reviewIndex] };
  },

  // Helper methods for current auth state
  getCurrentUser: (): User | null => {
    return mockStorage.user;
  },

  getToken: (): string | null => {
    return mockStorage.token;
  },
};
