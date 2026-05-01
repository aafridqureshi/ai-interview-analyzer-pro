const express = require("express");
const Interview = require("../models/Interview");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userEmail, questions, answers, feedback } = req.body;

    const saved = await Interview.create({
      userEmail,
      questions,
      answers,
      feedback,
    });

    res.status(201).json({
      message: "Interview result saved",
      interview: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save interview result" });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const data = await Interview.find({
      userEmail: req.params.email.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interview history" });
  }
});

module.exports = router;  