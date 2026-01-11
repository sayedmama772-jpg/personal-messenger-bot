import { detectIntent } from "./engine/detectIntent.js";
import { REPLIES } from "./data/replies.js";

function getReply(intent) {
  const list = REPLIES[intent] || REPLIES.FALLBACK;
  return list[Math.floor(Math.random() * list.length)];
}

// TEST CASES
const tests = [
  "kmn aso bhai",
  "bhai ajkal obostha ki",
  "tumi ke",
  "online acho naki",
  "sayed kothay",
  "ajke mon valo na"
];

for (const msg of tests) {
  const intent = detectIntent(msg);
  console.log(msg, "=>", intent, "=>", getReply(intent));
}
