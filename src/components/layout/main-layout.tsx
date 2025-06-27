"use client";

import { AlertTriangle } from "lucide-react";
import Header from "./header";
import ApiKeyDialog from "../config/api-key-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
  apiKeyOk: boolean | null;
}

export default function MainLayout({ children, apiKeyOk }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      {apiKeyOk === false && (
        <Alert variant="destructive" className="m-4 rounded-lg border-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Your Gemini API key is not configured. Please set it up to use the app.</span>
              <ApiKeyDialog>
                <Button variant="destructive" size="sm">Show Instructions</Button>
              </ApiKeyDialog>
            </AlertDescription>
        </Alert>
      )}
      {children}
    </div>
  );
}
