const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/upload", upload.any(), (req, res) => {
  console.log("file", req.file);

  res.send("end");
  // need to upload file
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000/");
});
