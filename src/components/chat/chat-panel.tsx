"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Trash2, Bot } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChatMessage from "./chat-message";

interface ChatPanelProps {
  messages: ChatMessageType[];
  onNewMessage: (message: string) => void;
  isSending: boolean;
  clearChat: () => void;
}

export default function ChatPanel({
  messages,
  onNewMessage,
  isSending,
  clearChat
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSending) {
      onNewMessage(input.trim());
      setInput("");
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
            <Bot />
            Chat
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={clearChat} aria-label="Clear chat">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isSending && (
              <div className="flex items-start space-x-4">
                <div className="bg-primary rounded-full p-2">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your flow, e.g., 'Create a chatbot that uses a vector store...'"
            className="min-h-0 flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isSending}>
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
