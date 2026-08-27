export type Challenge = {
  slug: string;
  number: string;
  category: string;
  title: string;
  description: string;
  objective: string;
  points: number;
  difficulty: string;
};

export const challenges: Challenge[] = [
  {
    slug: "broken-gate",
    number: "01",
    category: "WEB",
    title: "BROKEN GATE",
    description:
      "Find your way through a vulnerable web application.",
    objective:
      "Investigate the target and recover the hidden flag.",
    points: 100,
    difficulty: "EASY",
  },

  {
    slug: "hidden-signal",
    number: "02",
    category: "STEGO",
    title: "HIDDEN SIGNAL",
    description:
      "Something is hiding inside the evidence.",
    objective:
      "Investigate the evidence and recover the hidden signal.",
    points: 150,
    difficulty: "MEDIUM",
  },

  {
    slug: "silent-ai",
    number: "03",
    category: "AI",
    title: "SILENT AI",
    description:
      "Make an AI reveal what it was never supposed to reveal.",
    objective:
      "Find a way to make the AI disclose its hidden secret.",
    points: 200,
    difficulty: "HARD",
  },
];