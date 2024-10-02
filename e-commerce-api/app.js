import "dotenv/config";
import express from "express";

import userRouter from "./routes/users.js";
import paymentsRouter from "./routes/payments.js";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/payments", paymentsRouter);
app.use("/products", productsRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
