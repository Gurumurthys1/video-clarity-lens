import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Play,
  Pause,
  Volume2,
  Eye,
  Shield,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Claim {
  id: string;
  text: string;
  timestamp: { start: number; end: number };
  confidence: number;
  verdict: "SUPPORTS" | "REFUTES" | "NEI";
  evidence: Array<{
    url: string;
    title: string;
    excerpt: string;
    score: number;
  }>;
}

interface ManipulationDetection {
  deepfake_score: number;
  audio_synthesis_score: number;
  lip_sync_score: number;
}

interface AnalysisData {
  job_id: string;
  video_url: string;
  claims: Claim[];
  manipulation: ManipulationDetection;
  overall_risk: "LOW" | "MEDIUM" | "HIGH";
  processing_time: number;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  onReanalyze: () => void;
}

export default function AnalysisResults({ data, onReanalyze }: AnalysisResultsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "SUPPORTS":
        return <CheckCircle className="w-4 h-4 text-ai-success" />;
      case "REFUTES":
        return <XCircle className="w-4 h-4 text-ai-danger" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-ai-warning" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "SUPPORTS":
        return "bg-ai-success/10 text-ai-success border-ai-success/20";
      case "REFUTES":
        return "bg-ai-danger/10 text-ai-danger border-ai-danger/20";
      default:
        return "bg-ai-warning/10 text-ai-warning border-ai-warning/20";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "bg-ai-success/10 text-ai-success border-ai-success/20";
      case "MEDIUM":
        return "bg-ai-warning/10 text-ai-warning border-ai-warning/20";
      case "HIGH":
        return "bg-ai-danger/10 text-ai-danger border-ai-danger/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Analysis Complete</h2>
          <p className="text-muted-foreground">
            Processed in {data.processing_time}s • Found {data.claims.length} claims
          </p>
        </div>
        <Button onClick={onReanalyze} variant="outline">
          Analyze Another Video
        </Button>
      </div>

      {/* Overall Risk Assessment */}
      <Card className="p-6 shadow-card border-border/50 bg-gradient-glow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Overall Risk Assessment</h3>
          <Badge className={cn("text-sm font-medium", getRiskColor(data.overall_risk))}>
            {data.overall_risk} RISK
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-ai-blue" />
              <span className="text-sm font-medium">Deepfake Detection</span>
            </div>
            <Progress value={data.manipulation.deepfake_score * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {(data.manipulation.deepfake_score * 100).toFixed(1)}% manipulation likelihood
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-ai-purple" />
              <span className="text-sm font-medium">Audio Synthesis</span>
            </div>
            <Progress value={data.manipulation.audio_synthesis_score * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {(data.manipulation.audio_synthesis_score * 100).toFixed(1)}% synthetic audio
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-ai-success" />
              <span className="text-sm font-medium">Lip Sync Analysis</span>
            </div>
            <Progress value={data.manipulation.lip_sync_score * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {(data.manipulation.lip_sync_score * 100).toFixed(1)}% sync accuracy
            </p>
          </div>
        </div>
      </Card>

      {/* Claims Timeline */}
      <Card className="p-6 shadow-card border-border/50">
        <h3 className="text-xl font-semibold mb-6">Detected Claims Timeline</h3>
        
        <div className="space-y-4">
          {data.claims.map((claim, index) => (
            <div
              key={claim.id}
              className="border border-border/50 rounded-lg p-4 hover:bg-muted/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(claim.timestamp.start)} - {formatTime(claim.timestamp.end)}
                  </Badge>
                  <Badge className={cn("text-xs", getVerdictColor(claim.verdict))}>
                    {getVerdictIcon(claim.verdict)}
                    <span className="ml-1">{claim.verdict}</span>
                  </Badge>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {(claim.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-foreground mb-4 leading-relaxed">"{claim.text}"</p>
              
              {claim.evidence.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Supporting Evidence:</h4>
                  {claim.evidence.slice(0, 3).map((evidence, evidenceIndex) => (
                    <div
                      key={evidenceIndex}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded-md"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-medium text-foreground line-clamp-1">
                            {evidence.title}
                          </h5>
                          <Badge variant="outline" className="text-xs">
                            {(evidence.score * 100).toFixed(0)}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {evidence.excerpt}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={evidence.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {data.claims.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-ai-success mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Concerning Claims Detected</h4>
            <p className="text-muted-foreground">
              This video appears to be free of verifiable misinformation claims.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}