// src/auth/middleware.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./services";

export function authMiddleware(auth: AuthService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const token = header.split(" ")[1];

    try {
      const payload = auth.verifyToken(token);
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ error: "INVALID_TOKEN" });
    }
  };
}
