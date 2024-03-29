// import CSVViewer from "@/components/CSVViewer";
import ChatComponents from "@/components/ChatComponents";
import ChatSideBar from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params: {
        chatId: string;
    };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/sign-in");
    }
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    if (!_chats) {
        return redirect("/");
    }
    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
        return redirect("/");
    }

    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
    return (
        <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
            <div className="flex">
                <div className="flex-[1]">
                    <ChatSideBar chatId={parseInt(chatId)} chats={_chats} />
                </div>
                <div className="p-4 flex-[5]">
                    csv
                    {/* <CSVViewer file_key={currentChat?.fileKey || ""} /> */}
                </div>
                <div className="flex-[3]">
                    <ChatComponents chatId={parseInt(chatId)}/>
                </div>
            </div>
        </div>

    )
}

export default ChatPage