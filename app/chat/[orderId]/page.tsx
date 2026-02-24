import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import ChatWindow from "@/components/chat/ChatWindow";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

type PageProps = {
  params: {
    orderId: string;
  };
};

export default async function ChatPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=/chat/${params.orderId}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      chatMessages: {
        orderBy: { createdAt: "asc" },
        take: 100,
        include: {
          sender: {
            select: {
              username: true
            }
          }
        }
      }
    }
  });

  if (!order || (order.buyerId !== session.user.id && order.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
    redirect("/orders");
  }

  const initialMessages = order.chatMessages.map((message) => ({
    id: message.id,
    sender: message.sender.username,
    text: message.message,
    createdAt: message.createdAt.toISOString()
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-semibold">Order Chat</h1>
      <p className="text-sm text-slate-400">Discuss delivery details securely for order #{order.id.slice(0, 8)}</p>
      <ChatWindow initialMessages={initialMessages} />
    </div>
  );
}
