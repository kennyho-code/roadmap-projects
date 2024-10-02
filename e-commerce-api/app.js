import "dotenv/config";
import express from "express";

import userRouter from "./routes/users.js";
import paymentsRouter from "./routes/payments.js";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/carts.js";
import authenticateToken from "./utils/authenticateToken.js";

const app = express();
// middlware
app.use(express.json());
app.use("/api", authenticateToken);

// public
app.use("/auth", authRouter);

//private
app.use("/api/users", userRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
