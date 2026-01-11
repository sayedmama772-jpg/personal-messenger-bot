import express from "express";
import fetch from "node-fetch";

import { detectIntent } from "./engine/detectIntent.js";
import { REPLIES } from "./data/replies.js";

const app = express();
app.use(express.json());

// ================= CONFIG =================
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ================= HELPERS =================
function getReply(intent) {
  const list = REPLIES[intent] || REPLIES.FALLBACK;
  return list[Math.floor(Math.random() * list.length)];
}

async function sendMessage(userId, text) {
  const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: userId },
      message: { text }
    })
  });
}

// ================= WEBHOOK VERIFY =================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ================= MESSAGE RECEIVE =================
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const event = entry?.messaging?.[0];

  if (!event || !event.message || event.message.is_echo) {
    return res.sendStatus(200);
  }

  const userId = event.sender.id;
  const text = event.message.text || "";

  const intent = detectIntent(text);
  const reply = getReply(intent);

  await sendMessage(userId, reply);

  res.sendStatus(200);
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Messenger bot running on port", PORT);
});
