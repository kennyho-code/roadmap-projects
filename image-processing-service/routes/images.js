import express from "express";
import multer from "multer";
import supabase from "../utils/supabase.js";
import { Queue } from "bullmq";
import sharp from "sharp";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageQueue = new Queue("imageQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

/*

curl -X POST http://localhost:3000/api/images/upload \
-H "Authorization: Bearer token here" \
-H "Content-Type: multipart/form-data" \
-F "image=@/Users/kennyho/Dev/roadmap-projects/image-processing-service/images/test.jpg"
*/
router.post("/upload", upload.single("image"), async (req, res) => {
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

router.post(/^(.+)\/transform$/, async (req, res) => {
  const filePath = req.params[0].slice(1);
  const transformOptions = req.body;

  console.log("filePath: ", filePath);

  try {
    const { data, error } = await supabase.storage
      .from("images")
      .createSignedUrl(filePath, 60);

    if (error) {
      return res.status(500).json({ error: "Failed to create signed URL" });
    }

    const signedUrl = data.signedUrl;
    console.log("signedUrl:", signedUrl);

    await imageQueue.add("transform", {
      signedUrl,
      transformOptions,
      filePath,
    });

    res.json({ message: "Image processing task added to the queue" });
  } catch (error) {
    console.error("Error adding task to the queue:", error);
    res.status(500).json({ error: "Failed to add task to the queue" });
  }
});

router.get("/:filePath", async (req, res) => {
  const userId = req.user.user.id;
  const filePath = req.params.filePath;

  try {
    const { data, error } = await supabase.storage
      .from("images")
      .download(`${userId}/${filePath}`);

    if (error) {
      console.log(error);
      throw error;
    }

    const buffer = await data.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    res.setHeader("Content-Type", data.type);
    res.setHeader("Content-Disposition", `attachment; file="${filePath}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).send("error downloading file");
  }
});

router.get("/list-files/:folder", async (req, res) => {
  const folder = req.params.folder;

  try {
    const { data, error } = await supabase.storage.from("images").list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).send("error downloading file");
  }
});

export default router;
