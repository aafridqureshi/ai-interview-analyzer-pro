const express = require("express");
const AptitudeResult = require("../models/AptitudeResult");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userEmail, score, total } = req.body;

    const saved = await AptitudeResult.create({
      userEmail: userEmail.toLowerCase(),
      score,
      total,
    });

    res.status(201).json({
      message: "Aptitude result saved",
      result: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save aptitude result" });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const data = await AptitudeResult.find({
      userEmail: req.params.email.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch aptitude history" });
  }
});

module.exports = router;