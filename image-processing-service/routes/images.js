import express from "express";
import multer from "multer";
import supabase from "../utils/supabase.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  console.log("req.file: ", req.file);

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const userId = req.user.user.id;
  const { originalname, buffer } = req.file;
  const filePath = `${userId}/${originalname}-${Date.now()}.jpg`;

  try {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, buffer);

    if (error) {
      console.log(error);
      throw error;
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/:id/transform", async (req, res) => {});

router.get("/:id", async (req, res) => {});

router.get("/", async (req, res) => {});

export default router;
