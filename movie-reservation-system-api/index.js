import express from "express";
import authRouter from "./routes/auth.js";
import authMiddleware from "./utils/authMiddlware.js";
import movieRouter from "./routes/movie.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/movie", authMiddleware, movieRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
