import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Code } from "lucide-react";

export default function ApiKeyDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code /> Configure Gemini API Key
          </DialogTitle>
          <DialogDescription>
            To enable generative features, you need to provide your Google
            Gemini API key.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <p>
            1. Create a new file named{" "}
            <code className="font-mono bg-muted px-1.5 py-1 rounded">
              .env.local
            </code>{" "}
            in the root directory of your project.
          </p>
          <p>
            2. Add the following line to the file, replacing{" "}
            <code className="font-mono bg-muted px-1.5 py-1 rounded">
              YOUR_API_KEY_HERE
            </code>{" "}
            with your actual key:
          </p>
          <pre className="p-3 rounded-md bg-muted text-muted-foreground overflow-x-auto">
            <code>GOOGLE_API_KEY='YOUR_API_KEY_HERE'</code>
          </pre>
          <p>
            3. Save the file and restart your development server for the changes
            to take effect.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
