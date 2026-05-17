import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const $set: Record<string, unknown> = {};
  if (typeof body.title === "string") $set.title = body.title;
  if (typeof body.date === "string") $set.date = body.date;
  if (typeof body.time === "string") $set.time = body.time;
  if (typeof body.duration === "number") $set.duration = body.duration;
  if (typeof body.color === "string") $set.color = body.color;
  if (typeof body.description === "string") $set.description = body.description;

  if (Object.keys($set).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection("events").findOneAndUpdate(
    { _id: new ObjectId(id), userId: session.user.id },
    { $set, $currentDate: { updatedAt: true } },
    { returnDocument: "after" },
  );

  if (!result)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: result._id.toString(),
    title: result.title,
    date: result.date,
    time: result.time,
    duration: result.duration,
    color: result.color,
    description: result.description ?? "",
  });
}

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const db = await getDb();
  const result = await db.collection("events").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  if (result.deletedCount === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}