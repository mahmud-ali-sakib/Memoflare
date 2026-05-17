import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseNoteId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

function serializeNote(doc: {
  _id: ObjectId;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
  updatedAt: Date;
  createdAt?: Date;
}) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    body: doc.body,
    tag: doc.tag,
    pinned: doc.pinned,
    updatedAt: doc.updatedAt,
    ...(doc.createdAt && { createdAt: doc.createdAt }),
  };
}

export async function PATCH(req: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const objectId = parseNoteId(id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid note id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const $set: Record<string, unknown> = {};

  if (typeof body.title === "string") $set.title = body.title;
  if (typeof body.body === "string") $set.body = body.body;
  if (typeof body.tag === "string") $set.tag = body.tag;
  if (typeof body.pinned === "boolean") $set.pinned = body.pinned;

  if (Object.keys($set).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const db = await getDb();

  const result = await db.collection("notes").findOneAndUpdate(
    { _id: objectId, userId: session.user.id },
    {
      $set,
      $currentDate: { updatedAt: true },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(serializeNote(result as Parameters<typeof serializeNote>[0]));
}

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const objectId = parseNoteId(id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid note id" }, { status: 400 });
  }

  const db = await getDb();

  const result = await db.collection("notes").deleteOne({
    _id: objectId,
    userId: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}