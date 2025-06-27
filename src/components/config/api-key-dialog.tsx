
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useState, useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {Code, Settings} from 'lucide-react';

export default function ApiKeyDialog({children}: {children: React.ReactNode}) {
  const [langflowUrl, setLangflowUrl] = useState('');
  const {toast} = useToast();

  useEffect(() => {
    // Fetch the stored Langflow URL on component mount
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.langflowUrl) {
          setLangflowUrl(data.langflowUrl);
        }
      });
  }, []);

  const handleSave = async () => {
    await fetch('/api/config', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({langflowUrl}),
    });
    toast({
      title: 'Settings Saved',
      description: 'Your Langflow URL has been saved.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings /> Configure Your Settings
          </DialogTitle>
          <DialogDescription>
            Configure your API keys and endpoints here.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div className="space-y-2">
            <Label htmlFor="langflow-url">Langflow URL</Label>
            <Input
              id="langflow-url"
              placeholder="http://127.0.0.1:7860"
              value={langflowUrl}
              onChange={e => setLangflowUrl(e.target.value)}
            />
             <p className="text-xs text-muted-foreground">
              The URL of your Langflow instance.
            </p>
          </div>
          <div className="space-y-2">
             <p className="font-medium flex items-center gap-2"><Code size={16}/> Gemini API Key</p>
             <p>
              To enable generative features, create a
              <code className="font-mono bg-muted px-1.5 py-1 rounded mx-1">
                .env.local
              </code>
              file in your project's root directory and add your Google Gemini API key.
            </p>
            <pre className="p-3 rounded-md bg-muted text-muted-foreground overflow-x-auto">
              <code>GOOGLE_API_KEY='YOUR_API_KEY_HERE'</code>
            </pre>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
