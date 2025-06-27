"use client";

import { useState, useEffect, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/lib/types";
import {
  handleChatMessage,
  isApiKeySet,
  sendToLangflow,
} from "@/app/actions";
import MainLayout from "@/components/layout/main-layout";
import ChatPanel from "@/components/chat/chat-panel";
import FlowPanel from "@/components/flow/flow-panel";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generatedJson, setGeneratedJson] = useState<string>("");
  const [apiKeyOk, setApiKeyOk] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    isApiKeySet().then(setApiKeyOk);
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm FlowCraft AI. Describe the Langflow flow you want to create, and I'll generate it for you.",
      },
    ]);
  }, []);

  const onNewMessage = (message: string) => {
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: message },
    ];
    setMessages(newMessages);

    startTransition(async () => {
      try {
        const chatHistory = newMessages
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n");
        const result = await handleChatMessage(chatHistory, generatedJson);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setGeneratedJson(result.json || "");

        if (!generatedJson) {
           setMessages(prev => [...prev, {id: Date.now().toString(), role: 'assistant', content: "I've created the initial version of your flow. You can see it on the right. Feel free to ask for any refinements!"}]);
        }

      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Error Generating Flow",
          description: e.message || "An unknown error occurred.",
        });
        setMessages(prev => prev.slice(0, -1)); // Remove user message on failure
      }
    });
  };

  const handleSendToLangflow = () => {
    if (!generatedJson) {
      toast({
        variant: "destructive",
        title: "No Flow to Send",
        description: "Please generate a flow first.",
      });
      return;
    }
    startTransition(async () => {
      try {
        const result = await sendToLangflow(generatedJson);
        if (result.success) {
          toast({
            title: "Flow Sent!",
            description: "The flow was successfully sent to your Langflow instance.",
          });
        } else {
          throw new Error(result.error);
        }
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Failed to Send Flow",
          description: e.message || "Please check if Langflow is running.",
        });
      }
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared. Let's start over! What kind of flow do you need?",
      },
    ]);
    setGeneratedJson("");
  }

  return (
    <MainLayout apiKeyOk={apiKeyOk}>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8 overflow-hidden">
        <ChatPanel
          messages={messages}
          onNewMessage={onNewMessage}
          isSending={isPending}
          clearChat={clearChat}
        />
        <FlowPanel
          generatedJson={generatedJson}
          setGeneratedJson={setGeneratedJson}
          onSendToLangflow={handleSendToLangflow}
          isProcessing={isPending}
        />
      </div>
    </MainLayout>
  );
}
