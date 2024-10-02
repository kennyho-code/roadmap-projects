import express from "express";
import supabase from "../utils/supabase.js";
const router = express().router;

router.get("/:productId", async function (req, res) {
  const productId = req.params.productId;
  const getProductQuery = supabase
    .from("products")
    .select()
    .eq("id", productId)
    .single();

  const { data, error } = await getProductQuery;

  if (error) {
    res.status(500).json({
      error: "unable to get product",
    });
    throw error;
  }
  res.status(200).json({ data });
});

router.post("/", async function (req, res) {
  const { name, price, stock_quantity } = req.body;
  const createProductQuery = supabase
    .from("products")
    .insert({ name, price, stock_quantity })
    .select();

  const { data, error } = await createProductQuery;
  if (error) {
    res.status(500).json({
      error: "unable to create product",
    });
    throw error;
  }
  res.status(201).json({ data });
});

router.delete("/", function (req, res) {
  res.send("User Delete");
});

router.put("/", function (req, res) {});

export default router;
