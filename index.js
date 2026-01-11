// index.js (test version, Messenger ছাড়া)
import { detectIntent } from "./engine/detectIntent.js";
import { REPLIES } from "./data/replies.js";

function getReply(intent) {
  const list = REPLIES[intent] || REPLIES.FALLBACK;
  return list[Math.floor(Math.random() * list.length)];
}

// TEST
const tests = [
  "kmn aso bhai",
  "bhai ajkal obostha ki",
  "tumi ke",
  "sayed kothay",
  "online acho naki",
  "ajke life onek jhamela"
];

for (const msg of tests) {
  const intent = detectIntent(msg);
  console.log(msg, "→", intent, "→", getReply(intent));
}
