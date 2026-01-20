export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  created_at: string;
}
