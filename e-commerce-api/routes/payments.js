import express from "express";
const router = express().router;

router.get("/", function (req, res) {
  res.send("User Get");
});

router.post("/", function (req, res) {
  res.send("User Post");
});

router.delete("/", function (req, res) {
  res.send("User Delete");
});

router.put("/", function (req, res) {
  res.send("User Poss");
});

export default router;
