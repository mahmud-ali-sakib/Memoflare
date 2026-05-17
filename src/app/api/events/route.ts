import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const docs = await db
    .collection("events")
    .find({ userId: session.user.id })
    .sort({ date: 1, time: 1 })
    .toArray();

  return NextResponse.json(
    docs.map((d) => ({
      id: d._id.toString(),
      title: d.title,
      date: d.date,
      time: d.time,
      duration: d.duration,
      color: d.color,
      description: d.description ?? "",
    })),
  );
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const doc = {
    userId: session.user.id,
    title: body.title ?? "Untitled",
    date: body.date,
    time: body.time ?? "09:00",
    duration: Number(body.duration ?? 60),
    color: body.color ?? "primary",
    description: body.description ?? "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!doc.date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection("events").insertOne(doc);

  return NextResponse.json(
    { id: result.insertedId.toString(), ...doc },
    { status: 201 },
  );
}