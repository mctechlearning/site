"use client";

import { Download, Send, Lightbulb, Clipboard, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ImproveFlowDialog from "./improve-flow-dialog";
import { useState } from "react";

interface FlowPanelProps {
  generatedJson: string;
  setGeneratedJson: (json: string) => void;
  onSendToLangflow: () => void;
  isProcessing: boolean;
}

export default function FlowPanel({
  generatedJson,
  setGeneratedJson,
  onSendToLangflow,
  isProcessing,
}: FlowPanelProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (!generatedJson) return;
    const blob = new Blob([generatedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flow.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded flow.json" });
  };

  const handleCopy = () => {
    if (!generatedJson) return;
    navigator.clipboard.writeText(generatedJson);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  }

  const formattedJson = (jsonString: string) => {
    try {
      if (!jsonString) return "";
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString; // Return original string if it's not valid JSON
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle>Generated Flow</CardTitle>
        <CardDescription>
          This is the generated Langflow JSON. You can refine it by chatting.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 relative">
        <Button variant="ghost" size="icon" className="absolute top-5 right-5 z-10" onClick={handleCopy} disabled={!generatedJson}>
          {copied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          <span className="sr-only">Copy JSON</span>
        </Button>
        <Textarea
          readOnly
          value={formattedJson(generatedJson)}
          placeholder="Your generated Langflow JSON will appear here..."
          className="w-full h-full resize-none font-mono text-xs"
        />
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <ImproveFlowDialog
          currentJson={generatedJson}
          onUpdateJson={setGeneratedJson}
          isProcessing={isProcessing}
        >
          <Button variant="outline" disabled={!generatedJson || isProcessing}>
            <Lightbulb className="mr-2 h-4 w-4" />
            Suggest Improvements
          </Button>
        </ImproveFlowDialog>
        <Button onClick={handleDownload} variant="outline" disabled={!generatedJson || isProcessing}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={onSendToLangflow} disabled={!generatedJson || isProcessing}>
          <Send className="mr-2 h-4 w-4" />
          Send to Langflow
        </Button>
      </CardFooter>
    </Card>
  );
}
