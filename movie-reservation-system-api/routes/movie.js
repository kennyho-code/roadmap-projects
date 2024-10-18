import supabase from "../utils/supabase.js";
import express from "express";

const router = express.Router();

// Create a movie
router.post("", async (req, res) => {
  const { title, director, year } = req.body;
  const { data, error } = await supabase
    .from("movies")
    .insert([{ title, director, year }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

// Read all movies
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("movie").select("*");

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Read a specific movie
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Movie not found" });
  return res.json(data);
});

// Update a movie
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, director, year } = req.body;
  const { data, error } = await supabase
    .from("movie")
    .update({ title, director, year })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Delete a movie
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("movie")
    .delete()
    .eq("id", id)
    .select();

  console.log(data, error);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
});

export default router;
