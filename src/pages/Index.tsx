import React, { useState } from 'react';
import { Activity, Target, Zap, CheckCircle } from 'lucide-react';
import { PDFUpload } from '@/components/PDFUpload';
import { ManualInput } from '@/components/ManualInput';
import { FitnessGoalGenerator } from '@/components/FitnessGoalGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import heroImage from '@/assets/fitness-hero.jpg';

const Index = () => {
  const [step, setStep] = useState<'input' | 'plan'>('input');
  const [inputMethod, setInputMethod] = useState<'pdf' | 'manual'>('pdf');
  const [fitnessData, setFitnessData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataExtracted = (data: any) => {
    setFitnessData(data);
    setStep('plan');
    setIsProcessing(false);
  };

  const handleUploadStart = () => {
    setIsProcessing(true);
  };

  const resetApp = () => {
    setStep('input');
    setFitnessData(null);
    setIsProcessing(false);
  };

  const features = [
    {
      icon: <Activity className="w-8 h-8 text-primary" />,
      title: "Smart Goal Setting",
      description: "AI-powered analysis of your fitness data to set realistic, achievable goals"
    },
    {
      icon: <Target className="w-8 h-8 text-accent" />,
      title: "Personalized Plans",
      description: "Custom workout and nutrition plans tailored to your budget and preferences"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-glow" />,
      title: "Progress Tracking",
      description: "Weekly milestones and progress monitoring to keep you motivated"
    }
  ];

  if (step === 'plan' && fitnessData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Fitness Plan</h1>
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
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Fitness and health activities" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Personal Fitness Goal Planner
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Transform your health with AI-powered, budget-aware fitness plans tailored to your unique goals and lifestyle
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-card hover:shadow-fitness transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Input Method Selection */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Get Started</h2>
            <p className="text-muted-foreground text-lg">
              Choose how you'd like to input your fitness data
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={inputMethod === 'pdf' ? 'fitness' : 'outline'}
              size="lg"
              onClick={() => setInputMethod('pdf')}
              className="flex-1 max-w-xs"
            >
              Upload BMI Report
            </Button>
            <Button
              variant={inputMethod === 'manual' ? 'fitness' : 'outline'}
              size="lg"
              onClick={() => setInputMethod('manual')}
              className="flex-1 max-w-xs"
            >
              Enter Manually
            </Button>
          </div>

          {/* Input Components */}
          <div className="max-w-2xl mx-auto">
            {inputMethod === 'pdf' ? (
              <PDFUpload 
                onDataExtracted={handleDataExtracted}
                onUploadStart={handleUploadStart}
              />
            ) : (
              <ManualInput onDataSubmitted={handleDataExtracted} />
            )}
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
              <Card className="shadow-fitness">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    <div>
                      <h3 className="font-semibold">Processing your data...</h3>
                      <p className="text-muted-foreground">This will take just a moment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
