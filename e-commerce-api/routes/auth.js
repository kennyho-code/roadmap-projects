import express from "express";
import bcrypt from "bcrypt";
import supabase from "../utils/supabase.js";
import { encrypt } from "../utils/session.js";
const router = express().router;

router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  const getUserQuery = supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();
  const { data, error } = await getUserQuery;
  if (error) {
    res.status(500);
    throw error;
  }

  const { password_hash } = data;

  const isValid = bcrypt.compareSync(password, password_hash);
  if (!isValid) {
    res.status(401).json({
      error: "Unauthorized",
      message: "You are not authorized to access this resource",
    });
  }

  const token = await encrypt({ email });
  res.status(200).json({ token });
});

export default router;
