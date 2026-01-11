// engine/detectIntent.js

import { WORDS } from "../data/keywords.js";
import { INTENTS } from "../data/intents.js";

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09ff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchWord(text, family) {
  return WORDS[family]?.some(word => text.includes(word));
}

// 🔥 এই export না থাকলেই Render crash করবে
export function detectIntent(rawText) {
  const text = normalize(rawText);

  let bestIntent = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;

    for (const key of intent.score) {
      if (matchWord(text, key)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent.name;
    }
  }

  if (bestScore > 0) return bestIntent;
  return "FALLBACK";
}
