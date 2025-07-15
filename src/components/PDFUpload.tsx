import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface PDFUploadProps {
  onDataExtracted: (data: any) => void;
  onUploadStart: () => void;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onDataExtracted, onUploadStart }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus('uploading');
    setFileName(file.name);
    onUploadStart();

    try {
      // Simulate PDF parsing - in real app, would use pdf-parse
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock extracted data from BMI report
      const mockData = {
        height: 176, // cm
        weight: 92, // kg
        bmi: 29.7,
        bodyFat: 18.5,
        muscleMass: 42.3,
        waterPercentage: 58.2,
        reportDate: new Date().toISOString(),
        source: 'pdf'
      };

      setUploadStatus('success');
      onDataExtracted(mockData);
      
      toast({
        title: "PDF processed successfully!",
        description: "Your BMI data has been extracted and analyzed.",
      });
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Processing failed",
        description: "Unable to extract data from PDF. Please try manual input.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing PDF...';
      case 'success':
        return 'Data extracted successfully!';
      case 'error':
        return 'Processing failed';
      default:
        return 'Upload BMI Report PDF';
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
                  <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
                )}
              </div>
              
              {uploadStatus === 'idle' && (
                <div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload">
                    <Button variant="fitness" size="lg" className="cursor-pointer">
                      Choose PDF File
                    </Button>
                  </label>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-retry"
                  />
                  <label htmlFor="pdf-retry">
                    <Button variant="outline" size="lg" className="cursor-pointer">
                      Try Again
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Supported formats: PDF • Max size: 10MB
          </div>
        </div>
      </CardContent>
    </Card>
  );
};