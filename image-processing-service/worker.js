import { Worker } from "bullmq";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const imageWorker = new Worker(
  "imageQueue",
  async (job) => {
    const { signedUrl, transformOptions, filePath } = job.data;

    try {
      const response = await fetch(signedUrl);

      const buffer = await response.arrayBuffer();

      const fileBuffer = Buffer.from(buffer);

      const transformedImage = await sharp(fileBuffer)
        .resize(
          transformOptions.transform.width,
          transformOptions.transform.height,
        )
        .toBuffer();

      const outputPath = path.join(
        "output",
        `${path.basename(filePath)}-transformed.png`,
      );
      fs.writeFileSync(outputPath, transformedImage);
    } catch (error) {
      console.error("Error transforming image:", error);
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);
