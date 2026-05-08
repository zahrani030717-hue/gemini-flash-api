import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { conversation } = req.body;

    if (!Array.isArray(conversation)) {
      return res.status(400).json({
        error: "Conversation harus array",
      });
    }

    const messages = conversation.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        systemInstruction:
          "Kamu adalah chatbot ramah dan selalu menjawab dalam Bahasa Indonesia.",
      },
    });

    res.json({
      result: response.text,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Terjadi kesalahan server",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});