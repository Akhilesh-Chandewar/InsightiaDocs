import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadFirebaseIntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getFirebaseUrl } from "@/lib/firebase";

export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    await loadFirebaseIntoPinecone(file_key);
    const csvUrl = await getFirebaseUrl(file_key);
    const chat_id = await db.insert(chats).values({
      userId,
      fileKey: file_key,
      csvName: file_name,
      csvUrl: csvUrl,
    }).returning({
      insertedId: chats.id,
    });

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}