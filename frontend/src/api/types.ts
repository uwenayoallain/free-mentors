export enum UserRole {
  USER = "USER",
  MENTOR = "MENTOR",
  ADMIN = "ADMIN",
}

export enum SessionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  COMPLETED = "COMPLETED",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mentor extends User {
  expertise: string[];
  rating: number;
  totalReviews: number;
  yearsOfExperience: number;
  availableDays: string[];
}

export interface Session {
  id: string;
  mentorId: string;
  userId: string;
  title: string;
  description: string;
  status: SessionStatus;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  sessionId: string;
  mentorId: string;
  userId: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SessionInput {
  mentorId: string;
  title: string;
  description: string;
  scheduledDate?: string;
}

export interface ReviewInput {
  sessionId: string;
  rating: number;
  comment: string;
}

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
