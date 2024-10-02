import express from "express";
import supabase from "../utils/supabase.js";
import bcrypt from "bcrypt";
const router = express().router;

router.get("/:id", async function (req, res) {
  const userId = req.params.id;
  const getUserQuery = supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  const { data, error } = await getUserQuery;
  if (error) {
    res.status(500);
    throw error;
  }

  res.status(201).json(data);
});

router.post("/", async function (req, res, next) {
  const { email, password } = req.body;

  const password_hash = bcrypt.hashSync(password, 10);

  const createUserQuery = supabase
    .from("users")
    .insert({ email, password_hash })
    .select();

  const { data, error } = await createUserQuery;
  if (error) {
    res.status(500);
    throw error;
  }

  res.status(201).json(data);
});

router.delete("/", function (req, res) {
  res.send("User Delete");
});

router.put("/", function (req, res) {
  res.send("User Poss");
});

export default router;
