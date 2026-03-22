import Anthropic from "@anthropic-ai/sdk";
import {
  researchPrompt,
  structurePrompt,
  formatPrompt,
} from "./prompts";
import type { Attendee } from "./prompts";

const client = new Anthropic();
const MODEL = "claude-sonnet-4-6";

function log(step: string, message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n[${ timestamp }] 🔗 STEP: ${step}`);
  console.log(`${"─".repeat(50)}`);
  console.log(message);
}

async function callClaude(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }
  return textBlock.text;
}

export interface BriefInput {
  title: string;
  attendees: Attendee[];
  context?: string | undefined;
}

export interface BriefResult {
  research: string;
  structured: string;
  brief: string;
}

export async function generateBrief(input: BriefInput): Promise<BriefResult> {
  // Step 1: Research
  console.log("\n⏳ Step 1/3 — Researching background context...");
  const research = await callClaude(
    researchPrompt(input.title, input.attendees, input.context)
  );
  log("1/3 — Research Complete", research);

  // Step 2: Structure
  console.log("\n⏳ Step 2/3 — Structuring the brief...");
  const structured = await callClaude(structurePrompt(research));
  log("2/3 — Structure Complete", structured);

  // Step 3: Format
  console.log("\n⏳ Step 3/3 — Formatting executive brief...");
  const brief = await callClaude(formatPrompt(structured));
  log("3/3 — Final Brief Ready", brief);

  return { research, structured, brief };
}
