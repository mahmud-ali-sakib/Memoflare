export type EventColor = "primary" | "emerald" | "amber" | "rose" | "violet" | "cyan";

export interface CalendarEvent {
  id: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  duration: number; // minutes
  color: EventColor;
  description?: string;
}

export const COLOR_STYLES: Record<EventColor, { pill: string; dot: string; badge: string }> = {
  primary: {
    pill: "bg-primary/20 text-primary border-primary/25",
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary",
  },
  emerald: {
    pill: "bg-emerald-500/20 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
  },
  amber: {
    pill: "bg-amber-500/20 text-amber-400 border-amber-500/25",
    dot: "bg-amber-400",
    badge: "bg-amber-500/10 text-amber-400",
  },
  rose: {
    pill: "bg-rose-500/20 text-rose-400 border-rose-500/25",
    dot: "bg-rose-400",
    badge: "bg-rose-500/10 text-rose-400",
  },
  violet: {
    pill: "bg-violet-500/20 text-violet-400 border-violet-500/25",
    dot: "bg-violet-400",
    badge: "bg-violet-500/10 text-violet-400",
  },
  cyan: {
    pill: "bg-cyan-500/20 text-cyan-400 border-cyan-500/25",
    dot: "bg-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-400",
  },
};

export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const formatTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
};

export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, "0");
const pad = (n: number) => String(n).padStart(2, "0");

export const SEED_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Biology Quiz",
    date: `${y}-${m}-${pad(today.getDate())}`,
    time: "09:00",
    duration: 60,
    color: "emerald",
    description: "Chapter 4 & 5 — Cell biology and genetics.",
  },
  {
    id: 2,
    title: "CS Study Group",
    date: `${y}-${m}-${pad(today.getDate() + 1)}`,
    time: "14:00",
    duration: 90,
    color: "primary",
    description: "Sorting algorithms and graph traversal prep.",
  },
  {
    id: 3,
    title: "History Essay Due",
    date: `${y}-${m}-${pad(today.getDate() + 2)}`,
    time: "23:59",
    duration: 30,
    color: "amber",
    description: "Submit via the online portal before midnight.",
  },
  {
    id: 4,
    title: "Math Revision",
    date: `${y}-${m}-${pad(today.getDate() + 3)}`,
    time: "10:00",
    duration: 120,
    color: "violet",
    description: "Quadratics, calculus basics, and trigonometry.",
  },
  {
    id: 5,
    title: "Physics Lab",
    date: `${y}-${m}-${pad(today.getDate() + 5)}`,
    time: "13:00",
    duration: 90,
    color: "cyan",
    description: "Newton's laws practical experiment.",
  },
  {
    id: 6,
    title: "English Seminar",
    date: `${y}-${m}-${pad(today.getDate() + 7)}`,
    time: "11:00",
    duration: 60,
    color: "rose",
    description: "Shakespearean sonnets discussion.",
  },
];