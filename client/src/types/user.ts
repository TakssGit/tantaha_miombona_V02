export type UserRole =
  | "ADMIN"
  | "GESTIONNAIRE"
  | "QUALITE"
  | "PRODUCTION"
  | "COMMERCIAL"
  | "POINT_FOCAL"
  | "PRODUCTEUR"
  | "DISTRIBUTEUR";

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  mustChangePassword?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}
