import React, { useState } from "react";
import { Activity, Target, Zap, CheckCircle } from "lucide-react";
import { PDFUpload } from "@/components/PDFUpload";
import { ManualInput } from "@/components/ManualInput";
import { FitnessGoalGenerator } from "@/components/FitnessGoalGenerator";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/fitness-hero.jpg";
import Footer from "@/components/Footer";

const Index = () => {
  const [step, setStep] = useState<"input" | "plan">("input");
  const [inputMethod, setInputMethod] = useState<"pdf" | "manual">("pdf");
  const [fitnessData, setFitnessData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataExtracted = (data: any) => {
    setFitnessData(data);
    setStep("plan");
    setIsProcessing(false);
  };

  const handleUploadStart = () => {
    setIsProcessing(true);
  };

  const resetApp = () => {
    setStep("input");
    setFitnessData(null);
    setIsProcessing(false);
  };

  if (step === "plan" && fitnessData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your Fitness Plan
              </h1>
              <p className="text-muted-foreground">Personalized just for you</p>
            </div>
            <Button variant="outline" onClick={resetApp}>
              Start New Plan
            </Button>
          </div>

          <FitnessGoalGenerator data={fitnessData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full min-h-[60vh] md:min-h-[75vh] bg-gradient-hero text-white overflow-hidden flex items-center">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={heroImage}
            alt="Fitness and health activities"
            className="w-full h-full object-cover object-center opacity-20"
            style={{
              minWidth: "100vw",
              left: "50%",
              transform: "translateX(-50%)",
              position: "absolute",
              top: 0,
              height: "100%",
              maxHeight: "100vh",
            }}
          />
          <div className="absolute inset-0 w-full h-full bg-gradient-hero/80"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 flex items-center min-h-[60vh] md:min-h-[75vh]">
          <div className="text-center max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Personal Fitness Goal Planner
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Transform your health with AI-powered, budget-aware fitness plans
              tailored to your unique goals and lifestyle
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <CheckCircle className="w-5 h-5" />
                <span>BMI Report Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <CheckCircle className="w-5 h-5" />
                <span>Budget Optimization</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <CheckCircle className="w-5 h-5" />
                <span>Weekly Milestones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Input Method Selection */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Get Started</h2>
            <p className="text-muted-foreground text-lg">
              Choose how you'd like to input your fitness data
            </p>
          </div>

          <a
            href="https://your-bmi-service-link.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary text-center text-lg sm:text-xl font-semibold hover:underline"
            style={{ textDecoration: "none" }}
          >
            <div
              className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mb-8 mx-auto bg-primary/10 border-2 border border-primary rounded-lg p-4 sm:p-6 shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
              style={{
                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              }}
            >
              🥳{" "}
              <span className="shiny-text">
                {" "}
                Get your BMI at{" "}
                <span className="font-bold text-primary">₹199/- </span>
                only
              </span>
            </div>
          </a>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={inputMethod === "pdf" ? "fitness" : "outline"}
              size="lg"
              onClick={() => setInputMethod("pdf")}
              className="flex-1 max-w-xs"
            >
              Upload BMI Report
            </Button>
            <Button
              variant={inputMethod === "manual" ? "fitness" : "outline"}
              size="lg"
              onClick={() => setInputMethod("manual")}
              className="flex-1 max-w-xs"
            >
              Enter Manually
            </Button>
          </div>

          {/* Input Components */}
          <div className="max-w-2xl mx-auto">
            {inputMethod === "pdf" ? (
              <PDFUpload
                onDataExtracted={handleDataExtracted}
                onUploadStart={handleUploadStart}
              />
            ) : (
              <ManualInput onDataSubmitted={handleDataExtracted} />
            )}
          </div>

          {/* Processing State */}
          {/* {isProcessing && (
            <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
              <Card className="shadow-fitness">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    <div>
                      <h3 className="font-semibold">Processing your data...</h3>
                      <p className="text-muted-foreground">
                        This will take just a moment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )} */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
