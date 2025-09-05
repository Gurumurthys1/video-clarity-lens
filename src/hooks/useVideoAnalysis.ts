import { useState, useCallback } from "react";
import { toast } from "sonner";

interface AnalysisState {
  isProcessing: boolean;
  currentStage: string;
  progress: number;
  data: any;
  error: string | null;
}

interface ProcessingStage {
  stage: string;
  progress: number;
  message?: string;
}

export function useVideoAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    isProcessing: false,
    currentStage: "",
    progress: 0,
    data: null,
    error: null
  });

  const simulateAnalysis = useCallback(async (videoUrl: string) => {
    setState({
      isProcessing: true,
      currentStage: "download",
      progress: 0,
      data: null,
      error: null
    });

    const stages = [
      { stage: "download", duration: 3000, message: "Downloading video..." },
      { stage: "transcription", duration: 4000, message: "Transcribing audio..." },
      { stage: "ocr", duration: 2000, message: "Analyzing visual content..." },
      { stage: "claims", duration: 3000, message: "Detecting claims..." },
      { stage: "retrieval", duration: 2500, message: "Retrieving evidence..." },
      { stage: "verification", duration: 3500, message: "Verifying facts..." },
      { stage: "manipulation", duration: 2000, message: "Checking for manipulation..." }
    ];

    try {
      for (let i = 0; i < stages.length; i++) {
        const currentStage = stages[i];
        setState(prev => ({
          ...prev,
          currentStage: currentStage.stage,
          progress: 0
        }));

        // Simulate progress for current stage
        for (let progress = 0; progress <= 100; progress += 5) {
          await new Promise(resolve => setTimeout(resolve, currentStage.duration / 20));
          setState(prev => ({
            ...prev,
            progress
          }));
        }
      }

      // Generate mock analysis results
      const mockResults = {
        job_id: "mock-" + Date.now(),
        video_url: videoUrl,
        overall_risk: Math.random() > 0.7 ? "HIGH" : Math.random() > 0.4 ? "MEDIUM" : "LOW",
        processing_time: Math.round(20 + Math.random() * 15),
        manipulation: {
          deepfake_score: Math.random() * 0.3,
          audio_synthesis_score: Math.random() * 0.2,
          lip_sync_score: 0.85 + Math.random() * 0.15
        },
        claims: generateMockClaims()
      };

      setState({
        isProcessing: false,
        currentStage: "",
        progress: 100,
        data: mockResults,
        error: null
      });

      toast.success("Analysis complete!", {
        description: `Found ${mockResults.claims.length} claims to review`
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: "Analysis failed. Please try again."
      }));
      
      toast.error("Analysis failed", {
        description: "There was an error processing your video. Please try again."
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      currentStage: "",
      progress: 0,
      data: null,
      error: null
    });
  }, []);

  return {
    ...state,
    analyzeVideo: simulateAnalysis,
    reset
  };
}

function generateMockClaims() {
  const mockClaims = [
    {
      text: "Climate change is a natural phenomenon that has nothing to do with human activity",
      verdict: "REFUTES" as const,
      confidence: 0.92,
      evidence: [
        {
          title: "IPCC Sixth Assessment Report: Climate Change 2021",
          excerpt: "It is unequivocal that human influence has warmed the planet, at a rate that is unprecedented in at least the last 2000 years.",
          url: "https://ipcc.ch/ar6-wg1/",
          score: 0.95
        },
        {
          title: "NASA: Scientific Evidence for Earth's Climate Change",
          excerpt: "Multiple studies have shown that human activities are the primary driver of climate change since the mid-20th century.",
          url: "https://climate.nasa.gov/scientific-consensus/",
          score: 0.89
        }
      ]
    },
    {
      text: "Vaccines contain microchips for tracking people",
      verdict: "REFUTES" as const,
      confidence: 0.98,
      evidence: [
        {
          title: "CDC: Facts about COVID-19 Vaccines",
          excerpt: "COVID-19 vaccines do not contain microchips. The ingredients in COVID-19 vaccines are publicly available.",
          url: "https://cdc.gov/coronavirus/2019-ncov/vaccines/facts.html",
          score: 0.97
        }
      ]
    },
    {
      text: "The Earth's population is approximately 8 billion people",
      verdict: "SUPPORTS" as const,
      confidence: 0.95,
      evidence: [
        {
          title: "World Population Prospects 2022 - United Nations",
          excerpt: "The world population reached 8.0 billion in mid-November 2022 from an estimated 2.5 billion people in 1950.",
          url: "https://population.un.org/wpp/",
          score: 0.99
        }
      ]
    }
  ];

  // Randomly select 1-3 claims
  const numClaims = Math.floor(Math.random() * 3) + 1;
  const selectedClaims = mockClaims
    .sort(() => Math.random() - 0.5)
    .slice(0, numClaims)
    .map((claim, index) => ({
      id: `claim-${index}`,
      text: claim.text,
      timestamp: {
        start: Math.floor(Math.random() * 300),
        end: Math.floor(Math.random() * 300) + 30
      },
      confidence: claim.confidence,
      verdict: claim.verdict,
      evidence: claim.evidence
    }));

  return selectedClaims;
}