import express from "express";
const router = express.Router();
import supabase from "../utils/supabase.js";

router.post("/", async (req, res) => {
  const { workout_plan_id, user_id, scheduled_date } = req.body;
  const { data, error } = await supabase
    .from("schedule_workout")
    .insert([{ workout_plan_id, user_id, scheduled_date }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Read Scheduled Workouts
router.get("/", async (req, res) => {
  const { id, user_id, workout_plan_id } = req.query;
  const filters = {};
  if (id) filters.id = id;
  if (user_id) filters.user_id = user_id;
  if (workout_plan_id) filters.workout_plan_id = workout_plan_id;

  const { data, error } = await supabase
    .from("schedule_workout")
    .select("*")
    .match(filters);

  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Read a Specific Scheduled Workout
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("schedule_workout")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Update a Scheduled Workout
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase
    .from("schedule_workout")
    .update(updates)
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Delete a Scheduled Workout
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("schedule_workout")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.status(204).json(data);
});

export default router;
