import express from "express";
const router = express.Router();
import supabase from "../utils/supabase.js";

// Create a new workout exercise detail
router.post("/", async (req, res) => {
  const { workout_plan_id, exercise_id, repetitions, sets, weight } = req.body;
  const { data, error } = await supabase
    .from("workout_exercise_details")
    .insert([{ workout_plan_id, exercise_id, repetitions, sets, weight }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Get all workout exercise details
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("workout_exercise_details")
    .select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Get a specific workout exercise detail by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("workout_exercise_details")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Update a workout exercise detail by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { workout_plan_id, exercise_id, repetitions, sets, weight } = req.body;
  const { data, error } = await supabase
    .from("workout_exercise_details")
    .update({ workout_plan_id, exercise_id, repetitions, sets, weight })
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Delete a workout exercise detail by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("workout_exercise_details")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

export default router;
