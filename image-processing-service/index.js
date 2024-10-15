import express from "express";
import authRouter from "./routes/auth.js";
import imagesRouter from "./routes/images.js";
import authMiddleware from "./utils/authMiddlware.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/images", authMiddleware, imagesRouter);
app.use("/", (req, res) => {
  res.end("hello world");
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
