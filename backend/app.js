// import "dotenv/config";
// import express from "express";
// import axios from "axios";

// const app = express();
// app.use(express.json());

// // Add this route to check if the backend is working
// app.get("/", (req, res) => {
//   res.send("Hello, World! Your backend is working.");
// });

// app.post("/ask-gemini", async (req, res) => {
//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ role: "user", parts: [{ text: req.body.question }] }],
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`)
// );

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY is not defined in environment variables."
  );
  process.exit(1);
}

// Create Express instance
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
};
app.use(cors(corsOptions)); // Enable CORS for specific origins
app.use(express.json());

// Initialize Gemini AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Root route
app.get("/", (req, res) => {
  res.send("Hello, World! Your backend is working.");
});

// Generate content route
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ error: "Failed to generate content. Please try again later." });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
