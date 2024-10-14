import express from "express";
const router = express.Router();
import supabase from "../utils/supabase.js";

// Get all exercises
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("exercises").select("*");

  console.log("data: ", data);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
});

router.put("/exercises/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, category_id } = req.body;

  const { data, error } = await supabase
    .from("exercises")
    .update({ name, description, category_id })
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
});

router.post("/", async (req, res) => {
  const { name, description, category_id } = req.body;

  const { data, error } = await supabase
    .from("exercises")
    .insert([{ name, description, category_id }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

router.delete("/exercises/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
});

export default router;
