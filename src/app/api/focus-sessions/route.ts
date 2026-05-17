import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { endOfDay, startOfDay } from "@/lib/format";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const filter: Record<string, unknown> = { userId: session.user.id };
  if (from || to) {
    filter.endedAt = {};
    if (from) (filter.endedAt as Record<string, Date>).$gte = new Date(from);
    if (to) (filter.endedAt as Record<string, Date>).$lte = new Date(to);
  }

  const db = await getDb();
  const docs = await db
    .collection("focus_sessions")
    .find(filter)
    .sort({ endedAt: -1 })
    .toArray();

  return NextResponse.json(
    docs.map((d) => ({
      id: d._id.toString(),
      plannedSeconds: d.plannedSeconds,
      completedSeconds: d.completedSeconds,
      status: d.status,
      startedAt: d.startedAt,
      endedAt: d.endedAt,
    })),
  );
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const plannedSeconds = Number(body.plannedSeconds ?? 0);
  const completedSeconds = Number(body.completedSeconds ?? plannedSeconds);
  const status = body.status === "cancelled" ? "cancelled" : "completed";

  if (plannedSeconds <= 0 || completedSeconds < 0) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  const now = new Date();
  const doc = {
    userId: session.user.id,
    plannedSeconds,
    completedSeconds,
    status,
    startedAt: body.startedAt ? new Date(body.startedAt) : now,
    endedAt: now,
  };

  const db = await getDb();
  const result = await db.collection("focus_sessions").insertOne(doc);

  return NextResponse.json(
    { id: result.insertedId.toString(), ...doc },
    { status: 201 },
  );
}