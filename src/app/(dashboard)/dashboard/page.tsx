"use client";
import FocusTimer from "@/components/dashboard/FocusTimer";
import { useState, useEffect, useRef } from "react";

const STAT_CARDS = [
  {
    label: "Flashcards reviewed",
    value: "248",
    change: "+12 today",
    positive: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    accent: "text-primary bg-primary/10",
  },
  {
    label: "Study streak",
    value: "7 days",
    change: "Personal best!",
    positive: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    accent: "text-amber-400 bg-amber-500/10",
  },
  {
    label: "Quizzes taken",
    value: "34",
    change: "+3 this week",
    positive: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    accent: "text-emerald-400 bg-emerald-500/10",
  },
  {
    label: "Focus time",
    value: "3h 20m",
    change: "Today",
    positive: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    accent: "text-violet-400 bg-violet-500/10",
  },
];

const RECENT_NOTES = [
  { title: "Chapter 4 — Cell Biology", tag: "Biology", time: "2h ago" },
  { title: "Sorting Algorithms", tag: "CS", time: "Yesterday" },
  { title: "The French Revolution", tag: "History", time: "2 days ago" },
  { title: "Quadratic Equations", tag: "Math", time: "3 days ago" },
];

const TAG_COLORS: Record<string, string> = {
  Biology: "bg-emerald-500/15 text-emerald-400",
  CS: "bg-primary/15 text-primary",
  History: "bg-amber-500/15 text-amber-400",
  Math: "bg-violet-500/15 text-violet-400",
};

const UPCOMING = [
  { title: "Biology Quiz", date: "Today, 4:00 PM", icon: "◎" },
  { title: "History Essay due", date: "Tomorrow, 11:59 PM", icon: "❐" },
  { title: "CS Study group", date: "Fri, 6:00 PM", icon: "◈" },
];

// ── Page ───────────────────────────────────────────────────────
const DashboardPage = () => {
  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Overview
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Good morning, Mahmud
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          You have 3 items due this week. Keep it up!
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-5 flex flex-col gap-3"
          >
            <div
              className={`h-9 w-9 rounded-2xl flex items-center justify-center ${card.accent}`}
            >
              {card.icon}
            </div>
            <div>
              <p className="font-heading text-2xl font-bold tracking-tight">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {card.label}
              </p>
            </div>
            <p
              className={`text-xs font-medium ${card.positive ? "text-emerald-400" : "text-rose-400"}`}
            >
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent notes — 2 cols */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-base font-bold tracking-tight">
              Recent Notes
            </h2>
            <a
              href="/dashboard/notes"
              className="text-xs text-primary hover:underline font-medium"
            >
              View all →
            </a>
          </div>

          <div className="flex flex-col gap-1">
            {RECENT_NOTES.map((note) => (
              <div
                key={note.title}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 text-muted-foreground"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{note.title}</p>
                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[note.tag] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {note.tag}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {note.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Upcoming + Focus Timer as separate cards */}
        <div className="flex flex-col gap-6">
          {/* Focus Timer card */}
          <FocusTimer />

          {/* Upcoming card */}
          <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-base font-bold tracking-tight">
                Upcoming
              </h2>
              <a
                href="/dashboard/calendar"
                className="text-xs text-primary hover:underline font-medium"
              >
                Calendar →
              </a>
            </div>
            <div className="flex flex-col gap-2">
              {UPCOMING.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none mb-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
