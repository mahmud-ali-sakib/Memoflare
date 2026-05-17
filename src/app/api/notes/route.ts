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
    .collection("notes")
    .find({ userId: session.user.id })
    .sort({ pinned: -1, updatedAt: -1 })
    .toArray();

  return NextResponse.json(
    docs.map((d) => ({
      id: d._id.toString(),
      title: d.title,
      body: d.body,
      tag: d.tag,
      pinned: d.pinned,
      updatedAt: d.updatedAt,
    })),
  );
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const now = new Date();
  const doc = {
    userId: session.user.id,
    title: body.title ?? "",
    body: body.body ?? "",
    tag: body.tag ?? "CS",
    pinned: body.pinned ?? false,
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  const result = await db.collection("notes").insertOne(doc);

  return NextResponse.json(
    {
      id: result.insertedId.toString(),
      title: doc.title,
      body: doc.body,
      tag: doc.tag,
      pinned: doc.pinned,
      updatedAt: doc.updatedAt,
    },
    { status: 201 },
  );
}
