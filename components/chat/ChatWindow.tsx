"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Message = {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
};

export default function ChatWindow({ initialMessages = [] as Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");

  function sendMessage(event: FormEvent) {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "You",
        text: text.trim(),
        createdAt: new Date().toISOString()
      }
    ]);
    setText("");
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-4 h-80 space-y-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-3">
        {messages.length ? (
          messages.map((message) => (
            <div key={message.id} className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm">
              <p className="mb-1 text-xs text-slate-400">
                {message.sender} • {new Date(message.createdAt).toLocaleTimeString()}
              </p>
              <p>{message.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No messages yet.</p>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
