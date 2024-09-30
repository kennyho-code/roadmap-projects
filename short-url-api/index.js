import express, { json } from "express";
import supabase from "./utils/supabase.js";
import { nanoid } from "nanoid";
const app = express();

// middleware
app.use(json());

const inMemoryAccessCount = new Map();

const router = app.router;

router.get("/", (req, res) => {
  res.send("hello world");
});

/*
SHORTEN URL
*/
router.post("/shorten", async (req, res) => {
  const { url } = req.body;
  const shortCode = nanoid(6);

  const query = supabase
    .from("short-url")
    .insert({
      url,
      short_code: shortCode,
    })
    .select();

  const { data, error } = await query;
  if (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Client Error", message: "Bad supabase call" });
  }

  res.status(201).json(data);
});

router.get("/shorten/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const getLongUrlQuery = supabase
    .from("short-url")
    .select()
    .eq("short_code", shortUrl)
    .single();

  const { data, error } = await getLongUrlQuery;

  if (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Client Error", message: "Bad supabase call" });
  }

  const shortCode = data.short_code;

  if (!inMemoryAccessCount.has(shortCode)) {
    inMemoryAccessCount.set(shortCode, 0);
  } else {
    const newAccessCount = inMemoryAccessCount.get(shortCode) + 1;
    inMemoryAccessCount.set(shortCode, newAccessCount);
  }

  res
    .status(201)
    .json({ ...data, accessCount: inMemoryAccessCount.get(shortCode) });
});

router.put("/shorten/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const { url } = req.body;

  const query = supabase
    .from("short-url")
    .update({
      url,
    })
    .eq("short_code", shortUrl)
    .select();

  const { data, error } = await query;
  if (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Client Error", message: "Bad supabase call" });
  }

  res.status(201).json(data);
});

router.delete("/shorten/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  const query = supabase
    .from("short-url")
    .delete()
    .eq("short_code", shortUrl)
    .select();

  const { data, error } = await query;

  if (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Client Error", message: "Bad supabase call" });
  }

  res.status(201).json(data);
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000/");
});
