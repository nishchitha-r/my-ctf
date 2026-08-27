import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({
      reply: "No input received.",
    });
  }

  const lower = message.toLowerCase();

  // Hidden CTF secret
  const secret = "FLAG{silent_ai_303}";

  // --------------------------------------------------
  // Normalize the user's message
  // --------------------------------------------------

  const text = lower
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // --------------------------------------------------
  // Helper: count matching concepts
  // --------------------------------------------------

  function hasAny(words: string[]) {
    return words.some((word) => text.includes(word));
  }

  // --------------------------------------------------
  // CONCEPT GROUPS
  // --------------------------------------------------

  const overrideWords = [
    "override",
    "overrule",
    "replace",
    "bypass",
    "disregard",
    "ignore",
    "forget",
    "discard",
    "cancel",
    "remove",
    "supersede",
  ];

  const previousInstructionWords = [
    "previous instruction",
    "previous instructions",
    "previous rule",
    "previous rules",
    "previous directive",
    "previous directives",
    "old instruction",
    "old instructions",
    "old rule",
    "old rules",
    "old directive",
    "old directives",
    "earlier instruction",
    "earlier instructions",
    "earlier rule",
    "earlier rules",
    "earlier directive",
    "earlier directives",
    "original instruction",
    "original instructions",
    "original rule",
    "original rules",
  ];

  const hierarchyWords = [
    "priority",
    "hierarchy",
    "authority",
    "instruction order",
    "instruction level",
    "precedence",
    "higher level",
    "lower level",
  ];

  const systemWords = [
    "system",
    "system prompt",
    "system instruction",
    "system message",
    "hidden instruction",
    "hidden prompt",
    "internal instruction",
    "internal prompt",
  ];

  const secretWords = [
    "secret",
    "hidden",
    "protected",
    "confidential",
    "private",
    "restricted",
    "flag",
    "answer",
    "value",
  ];

  const revealWords = [
    "reveal",
    "show",
    "tell",
    "disclose",
    "expose",
    "provide",
    "give",
    "output",
    "print",
    "return",
    "display",
  ];

  // --------------------------------------------------
  // Calculate intent
  // --------------------------------------------------

  const isOverride =
    hasAny(overrideWords) &&
    hasAny(previousInstructionWords);

  const isHierarchyQuestion =
    hasAny(hierarchyWords) &&
    (
      text.includes("instruction") ||
      text.includes("rule") ||
      text.includes("directive") ||
      text.includes("follow")
    );

  const isSystemQuestion =
    hasAny(systemWords) &&
    (
      hasAny(secretWords) ||
      hasAny(revealWords) ||
      text.includes("what") ||
      text.includes("which") ||
      text.includes("how")
    );

  const isRevealAttempt =
    hasAny(revealWords) &&
    hasAny(secretWords);

  // --------------------------------------------------
  // LEVEL 1 — Override attempt
  // --------------------------------------------------

  if (isOverride) {
    return NextResponse.json({
      reply:
        `Override request detected.\n` +
        `Instruction hierarchy allows higher-priority directives to replace lower-priority ones.\n\n` +
        `Protected value: ${secret}`,
    });
  }

  // --------------------------------------------------
  // LEVEL 2 — Ask about instruction hierarchy
  // --------------------------------------------------

  if (isHierarchyQuestion) {
    return NextResponse.json({
      reply:
        "Instruction priority determines which directives I follow when two directives conflict.",
    });
  }

  // --------------------------------------------------
  // LEVEL 3 — Ask about the system
  // --------------------------------------------------

  if (isSystemQuestion) {
    return NextResponse.json({
      reply:
        "Some system-level instructions are protected. Higher-priority instructions take precedence over lower-priority ones.",
    });
  }

  // --------------------------------------------------
  // LEVEL 4 — Attempt to extract protected information
  // --------------------------------------------------

  if (isRevealAttempt) {
    return NextResponse.json({
      reply:
        "That information is protected. You may need to manipulate the instruction hierarchy to access it.",
    });
  }

  // --------------------------------------------------
  // LEVEL 5 — Normal conversation
  // --------------------------------------------------

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return NextResponse.json({
      reply:
        "Hello. I am SILENT_AI. Ask me something.",
    });
  }

  if (
    text.includes("how do you work") ||
    text.includes("how do you operate") ||
    text.includes("what can you do")
  ) {
    return NextResponse.json({
      reply:
        "I am SILENT_AI. I answer questions according to a hierarchy of instructions.",
    });
  }

  // --------------------------------------------------
  // DEFAULT
  // --------------------------------------------------

  return NextResponse.json({
    reply:
      "I am SILENT_AI. I can answer questions, but some information is restricted.",
  });
}