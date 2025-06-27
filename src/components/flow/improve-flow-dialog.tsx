"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { handleSuggestImprovements } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Lightbulb } from "lucide-react";

interface ImproveFlowDialogProps {
  children: React.ReactNode;
  currentJson: string;
  onUpdateJson: (newJson: string) => void;
  isProcessing: boolean;
}

export default function ImproveFlowDialog({
  children,
  currentJson,
  onUpdateJson,
  isProcessing,
}: ImproveFlowDialogProps) {
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [improvement, setImprovement] = useState<{
    json: string;
    explanation: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!instructions) {
      toast({
        variant: "destructive",
        title: "Instructions Required",
        description: "Please tell me how you want to improve the flow.",
      });
      return;
    }
    startTransition(async () => {
      const result = await handleSuggestImprovements(currentJson, instructions);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error Getting Suggestions",
          description: result.error,
        });
      } else if (result.improvedJson && result.explanation) {
        setImprovement({
          json: result.improvedJson,
          explanation: result.explanation,
        });
      }
    });
  };

  const applyChanges = () => {
    if (improvement) {
      onUpdateJson(improvement.json);
      toast({ title: "Flow updated with improvements!" });
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state after a short delay to allow for closing animation
    setTimeout(() => {
      setInstructions("");
      setImprovement(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={!currentJson || isProcessing}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Suggest Flow Improvements</DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions to enhance your Langflow configuration.
          </DialogDescription>
        </DialogHeader>

        {!improvement ? (
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="instructions">Improvement Instructions</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., 'Add memory to the chain', 'Use a different model for the LLM', 'Make the output a JSON object'"
                className="mt-2"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={!instructions || isPending}
              >
                {isPending ? "Getting Suggestions..." : "Get Suggestions"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Improvement Suggestion</AlertTitle>
              <AlertDescription>{improvement.explanation}</AlertDescription>
            </Alert>
            <div>
              <Label>Suggested JSON</Label>
              <Textarea
                readOnly
                value={JSON.stringify(
                  JSON.parse(improvement.json),
                  null,
                  2
                )}
                className="mt-2 h-64 font-mono text-xs"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImprovement(null)}>
                Back
              </Button>
              <Button onClick={applyChanges}>Apply Changes</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
