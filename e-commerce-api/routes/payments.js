import express from "express";
import processCheckout from "../utils/processCheckout.js";
import stripe from "../utils/stripe.js";
const router = express().router;

router.get("/", function (req, res) {
  res.send("User Get");
});

router.post("/", function (req, res) {
  res.send("User Post");
});

router.delete("/", function (req, res) {
  res.send("User Delete");
});

router.put("/", function (req, res) {
  res.send("User Put");
});

router.get("/overview", async function (req, res) {
  const userId = req.userId;

  console.log("userId: ", userId);
  await processCheckout(userId);

  res.send("Payments Overview");
});

router.post("/create-checkout-session", async function (req, res) {
  const YOUR_DOMAIN = "http://localhost.com";
  /*

  create products with prices here:
  https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=stripe-hosted#create-product-prices-upfront
  */

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1Q5WlHBNMEVC7WHHTwkVJwve",
        quantity: 1,
      },
    ],

    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
  // we can call this....then redirect on the frontend depending on the users intent
});

export default router;
