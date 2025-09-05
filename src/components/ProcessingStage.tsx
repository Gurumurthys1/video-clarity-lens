import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Mic, 
  Eye, 
  Search, 
  CheckCircle, 
  Shield,
  Brain,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "active" | "completed";
  progress?: number;
}

interface ProcessingStageProps {
  currentStage: string;
  progress: number;
}

export default function ProcessingStage({ currentStage, progress }: ProcessingStageProps) {
  const stages: ProcessingStage[] = [
    {
      id: "download",
      name: "Video Download",
      description: "Downloading and preprocessing video content",
      icon: <Download className="w-5 h-5" />,
      status: getStageStatus("download", currentStage),
      progress: currentStage === "download" ? progress : undefined
    },
    {
      id: "transcription",
      name: "Audio Transcription",
      description: "Extracting audio and generating timestamped transcripts",
      icon: <Mic className="w-5 h-5" />,
      status: getStageStatus("transcription", currentStage),
      progress: currentStage === "transcription" ? progress : undefined
    },
    {
      id: "ocr",
      name: "Visual Analysis",
      description: "Analyzing video frames and extracting text content",
      icon: <Eye className="w-5 h-5" />,
      status: getStageStatus("ocr", currentStage),
      progress: currentStage === "ocr" ? progress : undefined
    },
    {
      id: "claims",
      name: "Claim Detection",
      description: "Identifying potential factual claims in content",
      icon: <FileText className="w-5 h-5" />,
      status: getStageStatus("claims", currentStage),
      progress: currentStage === "claims" ? progress : undefined
    },
    {
      id: "retrieval",
      name: "Evidence Retrieval",
      description: "Searching for supporting or refuting evidence",
      icon: <Search className="w-5 h-5" />,
      status: getStageStatus("retrieval", currentStage),
      progress: currentStage === "retrieval" ? progress : undefined
    },
    {
      id: "verification",
      name: "Fact Verification",
      description: "Analyzing claims against retrieved evidence",
      icon: <Brain className="w-5 h-5" />,
      status: getStageStatus("verification", currentStage),
      progress: currentStage === "verification" ? progress : undefined
    },
    {
      id: "manipulation",
      name: "Manipulation Detection",
      description: "Checking for deepfakes and audio synthesis",
      icon: <Shield className="w-5 h-5" />,
      status: getStageStatus("manipulation", currentStage),
      progress: currentStage === "manipulation" ? progress : undefined
    }
  ];

  function getStageStatus(stageId: string, current: string): "pending" | "active" | "completed" {
    const stageOrder = ["download", "transcription", "ocr", "claims", "retrieval", "verification", "manipulation"];
    const currentIndex = stageOrder.indexOf(current);
    const stageIndex = stageOrder.indexOf(stageId);
    
    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  }

  const getStageIcon = (stage: ProcessingStage) => {
    if (stage.status === "completed") {
      return <CheckCircle className="w-5 h-5 text-ai-success" />;
    }
    if (stage.status === "active") {
      return (
        <div className="relative">
          {stage.icon}
          <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full" />
        </div>
      );
    }
    return <div className="text-muted-foreground">{stage.icon}</div>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow animate-pulse">
          <Brain className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Analyzing Video</h2>
        <p className="text-lg text-muted-foreground">
          Our AI is processing your video through multiple detection stages
        </p>
      </div>

      <Card className="p-8 shadow-card border-border/50 bg-gradient-glow">
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-start gap-4">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                stage.status === "completed" 
                  ? "bg-ai-success/10 border-ai-success" 
                  : stage.status === "active"
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/10 border-muted"
              )}>
                {getStageIcon(stage)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={cn(
                    "font-semibold transition-colors",
                    stage.status === "active" ? "text-primary" : "text-foreground"
                  )}>
                    {stage.name}
                  </h3>
                  {stage.status === "active" && stage.progress !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {Math.round(stage.progress)}%
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {stage.description}
                </p>
                
                {stage.status === "active" && stage.progress !== undefined && (
                  <Progress value={stage.progress} className="h-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          This usually takes 2-5 minutes depending on video length
        </p>
      </div>
    </div>
  );
}