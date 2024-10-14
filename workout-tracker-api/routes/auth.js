import express from "express";
import supabase from "../utils/supabase.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { user, session, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ user, session });
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ data });
});

export default router;
