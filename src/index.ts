import "dotenv/config";
import * as readline from "node:readline";
import * as fs from "node:fs";
import { generateBrief } from "./agent";
import type { Attendee } from "./prompts";

function createRL(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function collectAttendees(rl: readline.Interface): Promise<Attendee[]> {
  console.log('\n📋 Add attendees (format: "Name, Role"). Type "done" when finished.\n');

  const attendees: Attendee[] = [];
  let i = 1;

  while (true) {
    const input = await ask(rl, `  ${i}. `);
    if (input.toLowerCase() === "done") break;

    const comma = input.indexOf(",");
    if (comma === -1) {
      console.log('     ⚠ Use format "Name, Role" — try again.');
      continue;
    }

    const name = input.slice(0, comma).trim();
    const role = input.slice(comma + 1).trim();

    if (name && role) {
      attendees.push({ name, role });
      i++;
    } else {
      console.log('     ⚠ Use format "Name, Role" — try again.');
    }
  }

  return attendees;
}

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════════");
  console.log("   🤖 Meeting Brief Agent");
  console.log("   3-step agentic chain powered by Claude");
  console.log("═══════════════════════════════════════════");

  const rl = createRL();

  try {
    const title = await ask(rl, "\n📌 Meeting title: ");
    if (!title) {
      console.log("No title provided. Exiting.");
      return;
    }

    const attendees = await collectAttendees(rl);
    if (attendees.length === 0) {
      console.log("No attendees added. Exiting.");
      return;
    }

    const contextPath = await ask(
      rl,
      "\n📎 Path to context file (or press Enter to skip): "
    );
    let context: string | undefined;
    if (contextPath) {
      try {
        context = fs.readFileSync(contextPath, "utf-8");
        console.log(`   ✓ Loaded ${contextPath} (${context.length} chars)`);
      } catch {
        console.log(`   ⚠ Could not read "${contextPath}" — continuing without context.`);
      }
    }

    console.log("\n🚀 Starting 3-step agent chain...");
    console.log(`   Title: ${title}`);
    console.log(`   Attendees: ${attendees.map((a) => a.name).join(", ")}`);
    console.log(`   Context: ${context ? "provided" : "none"}`);

    const result = await generateBrief({ title, attendees, context });

    console.log("\n\n═══════════════════════════════════════════");
    console.log("   ✅ FINAL EXECUTIVE BRIEF");
    console.log("═══════════════════════════════════════════\n");
    console.log(result.brief);
    console.log("\n═══════════════════════════════════════════\n");
  } catch (err) {
    if (err instanceof Error) {
      console.error(`\n❌ Error: ${err.message}`);
    } else {
      console.error("\n❌ An unexpected error occurred.");
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
