import VideoUpload from "@/components/VideoUpload";
import ProcessingStage from "@/components/ProcessingStage";
import AnalysisResults from "@/components/AnalysisResults";
import { useVideoAnalysis } from "@/hooks/useVideoAnalysis";

const Index = () => {
  const { isProcessing, currentStage, progress, data, analyzeVideo, reset } = useVideoAnalysis();

  const handleVideoSubmit = (url: string) => {
    analyzeVideo(url);
  };

  const handleReanalyze = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {!isProcessing && !data && (
          <VideoUpload onVideoSubmit={handleVideoSubmit} isProcessing={isProcessing} />
        )}
        
        {isProcessing && (
          <ProcessingStage currentStage={currentStage} progress={progress} />
        )}
        
        {data && !isProcessing && (
          <AnalysisResults data={data} onReanalyze={handleReanalyze} />
        )}
      </div>
    </div>
  );
};

export default Index;
