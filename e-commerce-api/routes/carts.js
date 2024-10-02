import express from "express";
import { getCart, updateCartItem, addToCart } from "../utils/cart.js";
const router = express().router;

router.get("/:userId", function (req, res) {
  const userId = req.params.userId;
  const userCart = getCart(userId);
  res
    .status(200)
    .json({
      data: { userCart: JSON.stringify(Array.from(userCart.entries())) },
    });
});

router.post("/", function (req, res) {
  const { userId, productId, quantity } = req.body;
  const userCart = addToCart(userId, productId, quantity);

  res.status(201).json({
    message: "product added to cart",
    userCart: JSON.stringify(Array.from(userCart.entries())),
  });
});

router.delete("/", function (req, res) {
  const { userId, productId } = req.body;
  removeFromCart(userId, productId);
  res.status(204).json({ message: "Item removed from cart" });
});

router.put("/", function (req, res) {
  const { userId, productId, quantity } = req.body;
  updateCartItem(userId, productId, quantity);
  res.status(200).json({ message: "Cart updated" });
});

export default router;
