"use client";

import { BrainCircuit, KeyRound } from "lucide-react";
import ApiKeyDialog from "../config/api-key-dialog";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          FlowCraft AI
        </h1>
      </div>
      <ApiKeyDialog>
        <Button variant="outline" size="sm">
          <KeyRound className="mr-2 h-4 w-4" />
          API Key
        </Button>
      </ApiKeyDialog>
    </header>
  );
}
