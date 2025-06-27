"use client";

import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start space-x-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="bg-primary rounded-full p-2 flex-shrink-0">
          <Bot className="h-6 w-6 text-primary-foreground" />
        </div>
      )}

      <div
        className={cn(
          "px-4 py-3 rounded-xl max-w-lg",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
      
      {isUser && (
         <div className="bg-secondary text-secondary-foreground rounded-full p-2 flex-shrink-0">
          <User className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
