export enum UserType {
  MENTOR = "mentor",
  MENTEE = "mentee",
  ADMIN = "admin",
}

export enum SessionStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  COMPLETED = "completed",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserType; // Changed to UserType
  bio?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  address?: string;
  occupation?: string;
  isStaff?: boolean;
  userType?: UserType; // Changed to UserType
}

export type Mentor = User & {
  expertise: string[];
};

export interface Session {
  id: string;
  title?: string;
  mentor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  mentee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  topic: string;
  questions: string;
  status: SessionStatus;
  scheduledDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  session: {
    id: string;
  };
  rating: number;
  content: string;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  bio?: string;
  occupation?: string;
  expertise?: string;
  userType?: UserType; // Changed to UserType
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SessionInput {
  mentorId: string;
  topic: string;
  questions: string;
  scheduledDate?: string;
}

export interface ReviewInput {
  sessionId: string;
  rating: number;
  content: string;
}

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
