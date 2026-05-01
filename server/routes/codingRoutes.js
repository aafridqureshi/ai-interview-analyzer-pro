const express = require("express");
const CodingResult = require("../models/CodingResult");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userEmail, question, code, feedback } = req.body;

    const saved = await CodingResult.create({
      userEmail: userEmail.toLowerCase(),
      question,
      code,
      feedback,
    });

    res.status(201).json({
      message: "Coding result saved",
      result: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save coding result" });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const data = await CodingResult.find({
      userEmail: req.params.email.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coding history" });
  }
});

module.exports = router;