import express from "express";
import supabase from "../utils/supabase.js";

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.status(200).json({ user: data.user, session: data.session });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }

    // we need to know how triggers work because this needs to be atomic
    const userId = data.user.id;
    console.log("userId", userId);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        role: "customer",
      });

    if (profileError) {
      console.error(profileError);
      return res.status(401).json({ error: error.message });
    }

    res.status(201).json({ user: data.user, session: data.session });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
