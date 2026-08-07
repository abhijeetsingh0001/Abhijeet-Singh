import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Define ES module replacements
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
const PORT = 3000;
const MESSAGES_FILE = path.join(__dirname, "messages.json");

// Middleware
app.use(express.json());

// Helper to read messages
const readMessages = (): any[] => {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading messages file:", err);
  }
  return [];
};

// Helper to write messages
const writeMessages = (messages: any[]): boolean => {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing messages file:", err);
    return false;
  }
};

// Initialize messages store if not exists
if (!fs.existsSync(MESSAGES_FILE)) {
  writeMessages([
    {
      id: "seed-1",
      name: "Grace Hopper",
      email: "grace@computer.org",
      subject: "research",
      message: "An elegant systems portfolio! I love the implementation of the algorithmic sandbox. Keep building high-performance, low-level tools.",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      ip: "127.0.0.1"
    }
  ]);
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check & Diagnostics Telemetry
app.get("/api/health", (req, res) => {
  const messages = readMessages();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
    telemetry: {
      activeSockets: 1,
      totalPacketsTransmitted: messages.length,
      bufferCacheSize: Buffer.poolSize,
    }
  });
});

// 2. Contact Message Submission
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Required parameter fields (name, email, message) are missing."
    });
  }

  const messages = readMessages();
  const newMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
    ip: req.ip || "unknown"
  };

  messages.unshift(newMessage); // Prepend new message
  const success = writeMessages(messages);

  if (success) {
    res.status(201).json({
      success: true,
      messageId: newMessage.id,
      timestamp: newMessage.timestamp,
      packetSize: Buffer.byteLength(JSON.stringify(newMessage)),
    });
  } else {
    res.status(500).json({
      error: "Persistence failure",
      message: "Could not save the packet transaction securely on the disk database."
    });
  }
});

// 3. Retrieve Transmission Packets (Mock DB viewer for self)
app.get("/api/contact/list", (req, res) => {
  const messages = readMessages();
  res.json({
    success: true,
    count: messages.length,
    packets: messages
  });
});

// 4. Delete Transmission Packet
app.delete("/api/contact/:id", (req, res) => {
  const { id } = req.params;
  let messages = readMessages();
  const initialLength = messages.length;
  messages = messages.filter((m) => m.id !== id);

  if (messages.length === initialLength) {
    return res.status(404).json({ error: "Packet not found", message: `ID ${id} did not resolve.` });
  }

  const success = writeMessages(messages);
  if (success) {
    res.json({ success: true, deletedId: id });
  } else {
    res.status(500).json({ error: "Persistence failure" });
  }
});

// 5. AI Systems Advisor & Code Mentor (Gemini API)
app.post("/api/gemini/mentor", async (req, res) => {
  const { prompt, topic, codeContext } = req.body;

  if (!prompt && !topic) {
    return res.status(400).json({
      error: "Missing parameters",
      message: "Provide either a topic or prompt for the AI Systems Advisor."
    });
  }

  // Ensure Gemini API Key is available
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: "AI Config Offline",
      message: "Gemini API key is missing on the server. Please check Settings > Secrets."
    });
  }

  try {
    let fullPrompt = "";
    if (topic) {
      fullPrompt = `Review the systems engineering concept: "${topic}". Provide a neat first-principles breakdown of this topic, listing its practical implementation challenges, memory alignments, and algorithmic trade-offs. Include ASCII diagrams if helpful to map the data layout.`;
    } else {
      fullPrompt = prompt;
    }

    if (codeContext) {
      fullPrompt += `\n\nCode snippet context for your evaluation:\n\`\`\`\n${codeContext}\n\`\`\``;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: `You are "AuraMentor", an elite systems engineering professor and computer science academic advisor. 
Your goal is to explain high-performance computing, memory safety, caching, networks, OS concepts, and sorting algorithms from pure first principles.
Avoid generic AI fluff or over-simplified answers. Speak directly, write clear markdown with technical terms (e.g. cache lines, disk bounds, virtual memory, alignment).
When asked about algorithms or code, suggest real low-level design patterns and evaluate them using Time and Space Complexities.
Do not refer to yourself as a large language model. You are Abhijeet Singh's co-pilot and AI Academic Systems Advisor.`,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text,
      modelUsed: "gemini-3.5-flash",
      latencyMs: 1500, // simulated metadata
    });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({
      error: "AI Generation Failure",
      message: error.message || "An unexpected error occurred during model evaluation.",
    });
  }
});

// ==========================================
// VITE OR STATIC FILES MIDDLEWARE
// ==========================================

async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing in ${process.env.NODE_ENV || "development"} mode on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error("Failed to start server and frontend integration:", err);
  process.exit(1);
});
