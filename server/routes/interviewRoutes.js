const express = require("express");
const Interview = require("../models/interview");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userEmail, questions, answers, feedback } = req.body;

    if (!userEmail || !Array.isArray(questions) || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const saved = await Interview.create({
      userEmail: userEmail.toLowerCase(),
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
    if (!req.params.email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    const data = await Interview.find({
      userEmail: req.params.email.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interview history" });
  }
});

module.exports = router;  