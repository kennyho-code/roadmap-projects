import express from "express";
import supabase from "../utils/supabase.js";

const router = express.Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).send(error.message);
  }

  res.status(200).json(data);
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(401).send(error.message);
  }

  res.status(200).json(data);
});

export default router;
