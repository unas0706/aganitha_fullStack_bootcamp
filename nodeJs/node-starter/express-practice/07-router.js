import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log("Users router middleware executed");
  next();
});

usersRouter.get("/", (req, res) => {
  res.json({ users: ["user1", "user2"] });
});

usersRouter.get("/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

usersRouter.post("/", (req, res) => {
  res.status(201).json({ message: "User created", body: req.body });
});

const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
  console.log("Posts router middleware executed");
  next();
});

postsRouter.get("/", (req, res) => {
  res.json({ posts: ["post1", "post2"] });
});

postsRouter.get("/:id", (req, res) => {
  res.json({ postId: req.params.id });
});

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
