import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface PDFUploadProps {
  onDataExtracted: (data: any) => void;
  onUploadStart: () => void;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({
  onDataExtracted,
  onUploadStart,
}) => {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [fileName, setFileName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  // New input states
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [currency, setCurrency] = useState<string>("INR");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Refs for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const retryInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus("uploading");
    setFileName(file.name);
    setPdfFile(file);
    onUploadStart();

    try {
      // Simulate PDF parsing - in real app, would use pdf-parse
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock extracted data from BMI report
      const mockData = {
        height: 176, // cm
        weight: 92, // kg
        bmi: 29.7,
        bodyFat: 18.5,
        muscleMass: 42.3,
        waterPercentage: 58.2,
        reportDate: new Date().toISOString(),
        source: "pdf",
      };

      setUploadStatus("success");
      setExtractedData(mockData);

      toast({
        title: "PDF processed successfully!",
        description: "Your BMI data has been extracted and analyzed.",
      });
    } catch (error) {
      setUploadStatus("error");
      setExtractedData(null);
      toast({
        title: "Processing failed",
        description:
          "Unable to extract data from PDF. Please try manual input.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!extractedData || !pdfFile) {
      toast({
        title: "Missing PDF data",
        description: "Please upload and process a PDF file first.",
        variant: "destructive",
      });
      return;
    }
    if (!targetWeight || !goal || !budget) {
      toast({
        title: "Missing information",
        description:
          "Please fill in all fields: Target Weight, Goal, and Budget.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Prepare form data for API
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("targetWeight", targetWeight);
      formData.append("goal", goal);
      formData.append("budget", budget);
      formData.append("currency", currency);

      // Add extractedData as JSON string
      formData.append("extractedData", JSON.stringify(extractedData));

      // Replace with your actual API endpoint
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      onDataExtracted(result);

      toast({
        title: "Plan generated!",
        description: "Your personalized plan has been created.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description:
          "There was an error generating your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
        );
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Processing PDF...";
      case "success":
        return "Data extracted successfully!";
      case "error":
        return "Processing failed";
      default:
        return "Upload BMI Report PDF";
    }
  };

  // Handler for button click to trigger file input
  const handleChooseFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset so same file can be selected again
      fileInputRef.current.click();
    }
  };

  const handleRetryFileClick = () => {
    if (retryInputRef.current) {
      retryInputRef.current.value = "";
      retryInputRef.current.click();
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          BMI Report Upload
        </CardTitle>
        <CardDescription>
          Upload your BMI report PDF to automatically extract your health data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              {getStatusIcon()}
              <div>
                <p className="text-lg font-medium">{getStatusText()}</p>
                {fileName && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {fileName}
                  </p>
                )}
              </div>

              {uploadStatus === "idle" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button
                    variant="fitness"
                    size="lg"
                    className="cursor-pointer"
                    type="button"
                    onClick={handleChooseFileClick}
                  >
                    Choose PDF File
                  </Button>
                </div>
              )}

              {uploadStatus === "error" && (
                <div>
                  <input
                    ref={retryInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-retry"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer"
                    type="button"
                    onClick={handleRetryFileClick}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* New Inputs for Target Weight, Goal, and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="target-weight">Target Weight</Label>
              <Input
                id="target-weight"
                type="number"
                placeholder="e.g. 75"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="goal">Fitness Goal *</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="toning">Toning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Monthly Budget</Label>
              <div className="flex gap-2">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="budget"
                  type="number"
                  placeholder="100"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="fitness"
              size="lg"
              className="mt-4"
              onClick={handleGenerate}
              disabled={uploadStatus !== "success" || isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Supported formats: PDF • Max size: 10MB
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
