export type UserType = "citizen" | "employee" | "monitor";

export interface SignupData {
  name: string;
  email: string;
  password: string;
  gender: string;
  dob: string;
  household_id: number;
  educational_qualification: string;
  isEmployee?: boolean;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
  userType: UserType;
}

export interface AuthUser {
  id: number;
  name?: string;
  email: string;
  userType: UserType;
}

export interface AuthResponse {
  code: number;
  message: string;
  data?: AuthUser;
  token?: string;
}
