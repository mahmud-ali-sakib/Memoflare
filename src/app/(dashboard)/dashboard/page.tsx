"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import FocusTimer from "@/components/dashboard/FocusTimer";
import { formatUpdatedAt } from "@/lib/format";

type DashboardData = {
  user: { name: string };
  stats: { streakDays: number; focusTimeToday: string };
  dueThisWeek: number;
  recentNotes: { id: string; title: string; tag: string; updatedAt: string }[];
  upcoming: { id: string; title: string; date: string; icon: string }[];
};

const TAG_COLORS: Record<string, string> = {
  Biology: "bg-emerald-500/15 text-emerald-400",
  CS: "bg-primary/15 text-primary",
  History: "bg-amber-500/15 text-amber-400",
  Math: "bg-violet-500/15 text-violet-400",
};

const STREAK_ICON = (
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
);

const FOCUS_ICON = (
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
);

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed");
      const json: DashboardData = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed");
        const json: DashboardData = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const statCards = data
    ? [
        {
          label: "Study streak",
          value: `${data.stats.streakDays} day${data.stats.streakDays === 1 ? "" : "s"}`,
          change: data.stats.streakDays > 0 ? "Keep it going!" : "Start today",
          positive: true,
          icon: STREAK_ICON,
          accent: "text-amber-400 bg-amber-500/10",
        },
        {
          label: "Focus time",
          value: data.stats.focusTimeToday,
          change: "Today",
          positive: true,
          icon: FOCUS_ICON,
          accent: "text-violet-400 bg-violet-500/10",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Overview
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {greeting()}, {data?.user.name ?? "there"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {error ??
            `You have ${data?.dueThisWeek ?? 0} item${data?.dueThisWeek === 1 ? "" : "s"} due this week. Keep it up!`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-base font-bold tracking-tight">
              Recent Notes
            </h2>
            <Link
              href="/notes"
              className="text-xs text-primary hover:underline font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="flex flex-col gap-1">
            {data?.recentNotes.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No notes yet. Create one in Notes.
              </p>
            )}
            {data?.recentNotes.map((note) => (
              <Link
                key={note.id}
                href="/notes"
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/40 transition-colors"
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
                  {formatUpdatedAt(note.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <FocusTimer onSessionComplete={loadDashboard} />

          <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-base font-bold tracking-tight">
                Upcoming
              </h2>
              <Link
                href="/calendar"
                className="text-xs text-primary hover:underline font-medium"
              >
                Calendar →
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {data?.upcoming.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No upcoming events this week.
                </p>
              )}
              {data?.upcoming.map((item) => (
                <Link
                  key={item.id}
                  href="/calendar"
                  className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors"
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
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
