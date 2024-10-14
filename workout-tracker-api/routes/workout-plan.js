import express from "express";
const router = express.Router();
import supabase from "../utils/supabase.js";

router.post("/", async (req, res) => {
  const { user_id, name, description } = req.body;
  const { data, error } = await supabase
    .from("workout_plans")
    .insert([{ user_id, name, description }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Get all workout plans
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("workout_plans").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Get a specific workout plan by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Update a workout plan by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, name, description } = req.body;
  const { data, error } = await supabase
    .from("workout_plans")
    .update({ user_id, name, description })
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Delete a workout plan by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("workout_plans")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

export default router;
