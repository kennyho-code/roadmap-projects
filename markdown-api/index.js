const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const marked = require("marked");
const fs = require("node:fs");
const path = require("node:path");

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/upload", upload.any(), (req, res) => {
  const filePath = req.files[0].path;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const htmlContent = marked.parse(fileContent);

  fs.writeFileSync(
    `./html/${req.files[0].originalname.replace(".md", "")}-${new Date().getTime()}.html`,
    htmlContent,
  );

  // could add meta data in the database here, original_name, file_Name, updateload_date, file_size

  fs.unlinkSync(filePath);
  res.send(htmlContent);
});

app.get("/html/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join("html", `${fileName}.html`);

  const file = fs.readFileSync(filePath, "utf-8");
  res.send(file);
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000/");
});
