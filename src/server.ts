import "dotenv/config";
import express from "express";
import { generateBrief } from "./agent";
import type { Attendee } from "./prompts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/brief", async (req, res) => {
  const { meetingTitle, attendees, context } = req.body;

  if (!meetingTitle || typeof meetingTitle !== "string") {
    res.status(400).json({ error: "meetingTitle (string) is required" });
    return;
  }

  if (!Array.isArray(attendees) || attendees.length === 0) {
    res.status(400).json({ error: "attendees (array of {name, role}) is required" });
    return;
  }

  const invalidAttendee = attendees.find(
    (a: Attendee) => !a.name || !a.role
  );
  if (invalidAttendee) {
    res.status(400).json({ error: "Each attendee must have name and role" });
    return;
  }

  try {
    const result = await generateBrief({
      title: meetingTitle,
      attendees,
      context,
    });

    res.json({
      brief: result.brief,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error generating brief:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Meeting Brief Agent API running on http://localhost:${PORT}`);
  console.log(`   POST /api/brief  — Generate a meeting brief`);
  console.log(`   GET  /health     — Health check\n`);
});
