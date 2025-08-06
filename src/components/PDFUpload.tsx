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

// Modal UI (simple implementation, replace with your Modal component if needed)
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-full">
        {children}
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PDFUploadProps {
  onDataExtracted: (data: unknown) => void;
  onUploadStart: () => void;
}

type Gender = "male" | "female" | "other";
type Goal =
  | "weight_loss"
  | "muscle_gain"
  | "maintain_fitness"
  | "improve_stamina"
  | "improve_flexibility";
type DietPreference = "vegetarian" | "non_vegetarian" | "vegan" | "eggetarian";
type WorkoutTime = "morning" | "afternoon" | "evening" | "night";

interface UserInput {
  name: string;
  age: number;
  gender: Gender;
  goal: Goal;
  diet_preference: DietPreference;
  allergies: string[];
  health_conditions: string[];
  preferred_workout_time: WorkoutTime;
  workout_days_per_week: number;
  target_duration_months: number;
  monthly_budget_inr: number;
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
  const [pdfContent, setPdfContent] = useState<string>("");

  // User input states
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [dietPreference, setDietPreference] = useState<DietPreference | "">("");
  const [allergies, setAllergies] = useState<string>("");
  const [healthConditions, setHealthConditions] = useState<string>("");
  const [preferredWorkoutTime, setPreferredWorkoutTime] = useState<
    WorkoutTime | ""
  >("");
  const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState<string>("");
  const [targetDurationMonths, setTargetDurationMonths] = useState<string>("");
  const [monthlyBudgetInr, setMonthlyBudgetInr] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modal state for contact details
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Refs for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const retryInputRef = useRef<HTMLInputElement | null>(null);

  // Helper: Read PDF as base64 string
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          // Remove the data:application/pdf;base64, prefix if present
          const base64 = result.split(",")[1] || result;
          resolve(base64);
        } else {
          reject(new Error("Failed to read file as base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
      // Read PDF as base64 string
      const base64 = await readFileAsBase64(file);
      setPdfContent(base64);

      setUploadStatus("success");

      toast({
        title: "PDF uploaded successfully!",
        description: "Your BMI report PDF is ready for plan generation.",
      });
    } catch (error) {
      setUploadStatus("error");
      setPdfContent("");
      toast({
        title: "Processing failed",
        description:
          "Unable to read PDF file. Please try again or use a different file.",
        variant: "destructive",
      });
    }
  };

  // Instead of calling API directly, open modal for contact details
  const handleGenerate = async () => {
    // Validate all required fields
    if (
      !pdfContent ||
      !name ||
      !age ||
      !gender ||
      !goal ||
      !dietPreference ||
      !preferredWorkoutTime ||
      !workoutDaysPerWeek ||
      !targetDurationMonths ||
      !monthlyBudgetInr
    ) {
      toast({
        title: "Missing information",
        description:
          "Please fill in all required fields and upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    // Validate age, workoutDaysPerWeek, targetDurationMonths, monthlyBudgetInr
    const ageNum = parseInt(age, 10);
    const workoutDaysNum = parseInt(workoutDaysPerWeek, 10);
    const durationNum = parseInt(targetDurationMonths, 10);
    const budgetNum = parseInt(monthlyBudgetInr, 10);

    if (
      isNaN(ageNum) ||
      ageNum < 10 ||
      ageNum > 100 ||
      isNaN(workoutDaysNum) ||
      workoutDaysNum < 1 ||
      workoutDaysNum > 7 ||
      isNaN(durationNum) ||
      durationNum < 1 ||
      durationNum > 6 ||
      isNaN(budgetNum) ||
      budgetNum < 0
    ) {
      toast({
        title: "Invalid input values",
        description:
          "Please check that age, workout days, duration, and budget are within allowed ranges.",
        variant: "destructive",
      });
      return;
    }

    // Open contact modal
    setShowContactModal(true);
  };

  // API call on modal submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!contactName || !contactEmail || !contactPhone) {
      toast({
        title: "Contact details required",
        description: "Please fill in your name, email, and phone.",
        variant: "destructive",
      });
      return;
    }

    setIsContactSubmitting(true);

    // Prepare allergies and health_conditions as arrays
    const allergiesArr = allergies
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
    const healthConditionsArr = healthConditions
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    // Build the JSON payload
    const payload = {
      input_type: "bmi_pdf",
      pdf_content: pdfContent,
      user: {
        name,
        age: parseInt(age, 10),
        gender,
        goal,
        diet_preference: dietPreference,
        allergies: allergiesArr,
        health_conditions: healthConditionsArr,
        preferred_workout_time: preferredWorkoutTime,
        workout_days_per_week: parseInt(workoutDaysPerWeek, 10),
        target_duration_months: parseInt(targetDurationMonths, 10),
        monthly_budget_inr: parseInt(monthlyBudgetInr, 10),
      },
      contact: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      },
    };

    try {
      const response = await fetch(
        "https://n8n.wolvesandcompany.in/webhook/gg-nutritional-calculator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      onDataExtracted(result);

      toast({
        title: "Plan generated!",
        description: "Your personalized plan has been created.",
      });
      setShowContactModal(false);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
    } catch (error) {
      toast({
        title: "Generation failed",
        description:
          "There was an error generating your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsContactSubmitting(false);
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
        return "PDF uploaded successfully!";
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
    <>
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

            {/* User Inputs for Plan Generation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={10}
                  max={100}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={gender}
                  onValueChange={(v) => setGender(v as Gender)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goal">Fitness Goal *</Label>
                <Select value={goal} onValueChange={(v) => setGoal(v as Goal)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintain_fitness">
                      Maintain Fitness
                    </SelectItem>
                    <SelectItem value="improve_stamina">
                      Improve Stamina
                    </SelectItem>
                    <SelectItem value="improve_flexibility">
                      Improve Flexibility
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="diet-preference">Diet Preference *</Label>
                <Select
                  value={dietPreference}
                  onValueChange={(v) => setDietPreference(v as DietPreference)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non_vegetarian">
                      Non-Vegetarian
                    </SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="eggetarian">Eggetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="allergies">Allergies (comma separated)</Label>
                <Input
                  id="allergies"
                  type="text"
                  placeholder="e.g. peanuts, gluten"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="target-duration">
                  Target Duration (months) *
                </Label>
                <Input
                  id="target-duration"
                  type="number"
                  placeholder="e.g. 3"
                  value={targetDurationMonths}
                  onChange={(e) => setTargetDurationMonths(e.target.value)}
                  min={1}
                  max={6}
                />
              </div>
              <div>
                <Label htmlFor="monthly-budget">Monthly Budget (INR) *</Label>
                <Input
                  id="monthly-budget"
                  type="number"
                  placeholder="e.g. 5000"
                  value={monthlyBudgetInr}
                  onChange={(e) => setMonthlyBudgetInr(e.target.value)}
                  min={0}
                />
              </div>

              <div>
                <Label htmlFor="preferred-workout-time">
                  Preferred Workout Time *
                </Label>
                <Select
                  value={preferredWorkoutTime}
                  onValueChange={(v) =>
                    setPreferredWorkoutTime(v as WorkoutTime)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workout-days">Workout Days/Week *</Label>
                <Input
                  id="workout-days"
                  type="number"
                  placeholder="e.g. 5"
                  value={workoutDaysPerWeek}
                  onChange={(e) => setWorkoutDaysPerWeek(e.target.value)}
                  min={1}
                  max={7}
                />
              </div>
              <div>
                <Label htmlFor="health-conditions">
                  Health Conditions (comma separated)
                </Label>
                <Input
                  id="health-conditions"
                  type="text"
                  placeholder="e.g. diabetes, hypertension"
                  value={healthConditions}
                  onChange={(e) => setHealthConditions(e.target.value)}
                />
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

      {/* Contact Details Modal */}
      <Modal open={showContactModal} onClose={() => setShowContactModal(false)}>
        <form onSubmit={handleContactSubmit}>
          <div>
            <h2 className="text-lg font-semibold mb-2">Contact Details</h2>
            <div className="mb-2">
              <Label htmlFor="contact-name">Name *</Label>
              <Input
                id="contact-name"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="contact-email">Email *</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="contact-phone">Phone *</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Your phone number"
                autoComplete="tel"
                required
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                variant="fitness"
                size="lg"
                disabled={isContactSubmitting}
              >
                {isContactSubmitting ? "Submitting..." : "Submit & Generate"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
