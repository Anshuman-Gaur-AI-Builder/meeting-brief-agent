export interface Attendee {
  name: string;
  role: string;
}

export function researchPrompt(
  title: string,
  attendees: Attendee[],
  context?: string
): string {
  const attendeeList = attendees
    .map((a) => `- ${a.name} (${a.role})`)
    .join("\n");

  return `You are a senior executive assistant preparing background research for an upcoming meeting.

**Meeting Title:** ${title}

**Attendees:**
${attendeeList}

${context ? `**Additional Context:**\n${context}\n` : ""}
Generate thorough background research for this meeting:
1. What is this meeting likely about, given the title and attendees?
2. What background context would each attendee care about?
3. What are the key topics and talking points that should be covered?
4. What recent trends, data points, or industry context is relevant?
5. What potential tensions or differing perspectives might arise?

Be specific and actionable. This research will be used to build a structured meeting brief.`;
}

export function structurePrompt(research: string): string {
  return `You are a strategic meeting planner. Take the following research and structure it into a clear meeting brief framework.

**Research:**
${research}

Structure the output into exactly these five sections:

**Objective**
A single clear sentence stating the purpose and desired outcome of this meeting.

**Agenda Items**
A numbered list of 3-5 agenda items with estimated time allocations (e.g., "15 min"). Order them by priority.

**Key Talking Points**
Bullet points of the most important points to raise, grouped by agenda item. Include supporting data or context where relevant.

**Open Questions**
Questions that need to be answered during the meeting. Flag who should answer each one.

**Risks**
Potential risks, blockers, or sensitive topics to be aware of. Include mitigation suggestions where possible.

Be concise and executive-ready. No filler.`;
}

export function formatPrompt(structured: string): string {
  return `You are an executive communications specialist. Take the following structured meeting brief and format it as a polished, ready-to-send executive brief.

**Structured Brief:**
${structured}

Format rules:
- Use clear section headers with horizontal separators
- Keep language crisp and professional
- Use bullet points, not paragraphs
- Add a one-line "Bottom Line Up Front" (BLUF) at the very top summarizing the meeting purpose in a single sentence
- End with a "Prepared by AI Meeting Brief Agent" footer
- The brief should be immediately usable — no placeholders or TODOs

Output the final brief as plain text, ready to paste into an email or document.`;
}
