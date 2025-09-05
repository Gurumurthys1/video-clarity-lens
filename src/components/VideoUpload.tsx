import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Link, Play, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onVideoSubmit: (url: string) => void;
  isProcessing: boolean;
}

export default function VideoUpload({ onVideoSubmit, isProcessing }: VideoUploadProps) {
  const [url, setUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onVideoSubmit(url.trim());
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // For future file upload functionality
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary shadow-glow">
          <AlertTriangle className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          AI Misinformation Detection
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Analyze videos for potential misinformation using advanced AI. Get timestamped claims, 
          evidence verification, and manipulation detection.
        </p>
      </div>

      <Card className="p-8 shadow-card border-border/50 bg-gradient-glow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label htmlFor="video-url" className="text-lg font-semibold text-foreground">
              Video URL
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="video-url"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-lg"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
              dragActive ? "border-primary bg-primary/5" : "border-border/50",
              "hover:border-primary/50 hover:bg-gradient-glow"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-foreground mb-2">Drag and drop video files</p>
            <p className="text-sm text-muted-foreground">
              Supports YouTube, Vimeo, TikTok, and direct video files
            </p>
          </div>

          <Button
            type="submit"
            disabled={!url.trim() || isProcessing}
            className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Analyzing Video...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Analyze Video
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ai-success" />
              <span>Claim Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ai-blue" />
              <span>Evidence Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ai-warning" />
              <span>Deepfake Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ai-danger" />
              <span>Manipulation Analysis</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}