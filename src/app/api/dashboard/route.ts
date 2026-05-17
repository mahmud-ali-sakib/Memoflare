import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { addDays, endOfDay, formatFocusSeconds, startOfDay } from "@/lib/format";
import { formatTime, toDateKey } from "@/types/types";

function computeStreak(activeDates: string[]): number {
  if (activeDates.length === 0) return 0;
  const set = new Set(activeDates);
  let streak = 0;
  let cursor = startOfDay();

  while (set.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const db = await getDb();
  const todayStart = startOfDay();
  const todayEnd = endOfDay();
  const weekEnd = endOfDay(addDays(todayStart, 7));
  const todayKey = toDateKey(todayStart);

  const [notes, events, focusToday, focusAll] = await Promise.all([
    db
      .collection("notes")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(4)
      .toArray(),
    db
      .collection("events")
      .find({ userId, date: { $gte: todayKey, $lte: toDateKey(weekEnd) } })
      .sort({ date: 1, time: 1 })
      .limit(5)
      .toArray(),
    db
      .collection("focus_sessions")
      .find({
        userId,
        status: "completed",
        endedAt: { $gte: todayStart, $lte: todayEnd },
      })
      .toArray(),
    db
      .collection("focus_sessions")
      .find({ userId, status: "completed" })
      .project({ endedAt: 1, updatedAt: 1 })
      .toArray(),
  ]);

  const focusTodaySeconds = focusToday.reduce(
    (sum, s) => sum + (s.completedSeconds ?? 0),
    0,
  );

  const noteDates = await db
    .collection("notes")
    .find({ userId })
    .project({ updatedAt: 1 })
    .toArray();

  const activeDateSet = new Set<string>();
  for (const n of noteDates) {
    if (n.updatedAt) activeDateSet.add(toDateKey(new Date(n.updatedAt)));
  }
  for (const f of focusAll) {
    if (f.endedAt) activeDateSet.add(toDateKey(new Date(f.endedAt)));
  }

  const dueThisWeek = await db.collection("events").countDocuments({
    userId,
    date: { $gte: todayKey, $lte: toDateKey(weekEnd) },
  });

  const upcoming = events.slice(0, 3).map((e) => {
    const tomorrowKey = toDateKey(addDays(todayStart, 1));
    const dateLabel =
      e.date === todayKey
        ? `Today, ${formatTime(e.time)}`
        : e.date === tomorrowKey
          ? `Tomorrow, ${formatTime(e.time)}`
          : `${e.date}, ${formatTime(e.time)}`;

    return {
      id: e._id.toString(),
      title: e.title,
      date: dateLabel,
      icon: "◎",
    };
  });

  return NextResponse.json({
    user: {
      name: session.user.name ?? "Student",
    },
    stats: {
      streakDays: computeStreak([...activeDateSet]),
      focusTimeToday: formatFocusSeconds(focusTodaySeconds),
      focusTimeTodaySeconds: focusTodaySeconds,
    },
    dueThisWeek,
    recentNotes: notes.map((n) => ({
      id: n._id.toString(),
      title: n.title || "Untitled note",
      tag: n.tag,
      updatedAt: n.updatedAt,
    })),
    upcoming,
  });
}