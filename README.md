# Meeting Brief Agent

An agentic meeting brief generator that chains three sequential Claude API calls to produce executive-ready meeting briefs from minimal input.

## Why Three Calls?

A single prompt produces generic output. This agent uses a **Research → Structure → Format** pipeline where each step builds on the last:

1. **Research** — Given the meeting title, attendees, and optional context, Claude generates background research: what the meeting is likely about, what each stakeholder cares about, relevant talking points, and potential tensions.

2. **Structure** — The research output is fed into a second call that organizes it into five sections: Objective, Agenda Items, Key Talking Points, Open Questions, and Risks.

3. **Format** — The structured output is passed to a third call that polishes it into a clean executive brief with a BLUF (Bottom Line Up Front), consistent formatting, and no placeholders.

Each call has a focused job. The result is sharper than what a single prompt can produce — the same pattern used in production Copilot-style systems where multi-step reasoning outperforms monolithic prompts.

## Setup

```bash
git clone https://github.com/Anshuman-Gaur-AI-Builder/Meeting-Brief-Agent.git
cd Meeting-Brief-Agent
npm install
cp .env.example .env
```

Add your API key to `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

### CLI

```bash
npm start
```

**Example session:**

```
═══════════════════════════════════════════
   🤖 Meeting Brief Agent
   3-step agentic chain powered by Claude
═══════════════════════════════════════════

📌 Meeting title: Q2 Product Roadmap Review

📋 Add attendees (format: "Name, Role"). Type "done" when finished.

  1. Sarah Chen, VP Product
  2. Mike Ross, Engineering Lead
  3. Lisa Park, Head of Design
  4. done

📎 Path to context file (or press Enter to skip):

🚀 Starting 3-step agent chain...
   Title: Q2 Product Roadmap Review
   Attendees: Sarah Chen, Mike Ross, Lisa Park
   Context: none

⏳ Step 1/3 — Researching background context...
⏳ Step 2/3 — Structuring the brief...
⏳ Step 3/3 — Formatting executive brief...

═══════════════════════════════════════════
   ✅ FINAL EXECUTIVE BRIEF
═══════════════════════════════════════════

BLUF: Align on Q2 product priorities, resolve Engineering
capacity constraints, and lock the feature roadmap before
the April sprint cycle begins.

────────────────────────────────────────
OBJECTIVE
...
```

### HTTP API

```bash
npm run start:server
```

Starts an Express server on port 3000.

**Generate a brief:**

```bash
curl -X POST http://localhost:3000/api/brief \
  -H "Content-Type: application/json" \
  -d '{
    "meetingTitle": "Q2 Product Roadmap Review",
    "attendees": [
      {"name": "Sarah Chen", "role": "VP Product"},
      {"name": "Mike Ross", "role": "Engineering Lead"},
      {"name": "Lisa Park", "role": "Head of Design"}
    ],
    "context": "Q1 missed two feature deadlines due to platform migration"
  }'
```

**Response:**

```json
{
  "brief": "BLUF: Align on Q2 priorities and address delivery risk...\n\n────────────────\nOBJECTIVE\n...",
  "generatedAt": "2026-03-21T14:32:00.000Z"
}
```

**Health check:**

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

## API Reference

| Method | Endpoint     | Description            |
|--------|-------------|------------------------|
| POST   | /api/brief  | Generate meeting brief |
| GET    | /health     | Health check           |

**POST /api/brief body:**

| Field        | Type                       | Required |
|-------------|----------------------------|----------|
| meetingTitle | string                     | Yes      |
| attendees   | array of `{name, role}`    | Yes      |
| context     | string                     | No       |

## Tech Stack

- **TypeScript** — Type-safe agent logic
- **Node.js** — Runtime
- **Express** — HTTP API
- **@anthropic-ai/sdk** — Claude Sonnet 4.6 for all three chain steps
- **dotenv** — Environment variable management

## About

Built as part of a **10-day AI builder challenge**. This project demonstrates **agentic chaining patterns** — the same multi-step LLM orchestration used in production Copilot-style systems where decomposing a task into focused, sequential calls produces better results than a single monolithic prompt.
