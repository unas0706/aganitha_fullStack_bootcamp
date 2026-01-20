// src/auth/service.ts
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserDatabase } from "../database";
import { User } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = "1h";

export interface AuthJWTPayload extends JwtPayload {
  userId: number;
  role: "user" | "admin";
}

export class AuthService {
  constructor(private userDb: UserDatabase) {}

  async register(email: string, password: string): Promise<User> {
    const existing = await this.userDb.getUserByEmail(email);
    if (existing) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return this.userDb.createUser(email, passwordHash, "user");
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userDb.getUserByEmail(email);
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    return jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  verifyToken(token: string): AuthJWTPayload {
    return jwt.verify(token, JWT_SECRET) as AuthJWTPayload;
  }
}
