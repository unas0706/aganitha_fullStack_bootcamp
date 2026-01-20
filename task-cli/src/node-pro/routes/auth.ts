import { Router } from "express";
import { AuthService } from "../auth/services";

export function createAuthRouter(auth: AuthService) {
  const router = Router();

  router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const user = await auth.register(email, password);
    res.status(201).json(user);
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const token = await auth.login(email, password);
    res.json({ token });
  });

  return router;
}
