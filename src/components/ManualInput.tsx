import React, { useState } from "react";
import { Calculator, Target } from "lucide-react";
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
import { useData } from "@/hooks/get-fitness-data"; // <-- import your context

// Enhanced Modal implementation with improved width and UI
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-colors"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 min-w-[380px] max-w-[480px] w-full mx-4 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button in top-right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 6L14 14M14 6L6 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </div>
  );
};

interface ManualPlanInputUser {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height_cm: number;
  weight_kg: number;
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
  goal:
    | "weight_loss"
    | "muscle_gain"
    | "maintain_fitness"
    | "improve_stamina"
    | "improve_flexibility";
  diet_preference: "vegetarian" | "non_vegetarian" | "vegan" | "eggetarian";
  allergies?: string[];
  health_conditions?: string[];
  preferred_workout_time?: "morning" | "afternoon" | "evening" | "night";
  workout_days_per_week?: number;
  target_duration_months: number;
  monthly_budget_inr: number;
  phone?: string;
  email?: string;
}

interface ManualPlanInput {
  input_type: "manual";
  user: ManualPlanInputUser;
}

interface ManualInputProps {
  onDataSubmitted: (data: ManualPlanInput) => void;
}

const initialFormData = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  activity_level: "",
  goal: "",
  diet_preference: "",
  allergies: "",
  health_conditions: "",
  preferred_workout_time: "",
  workout_days_per_week: "",
  target_duration_months: "",
  monthly_budget_inr: "",
};

const initialContactData = {
  phone: "",
  email: "",
};

export const ManualInput: React.FC<ManualInputProps> = ({
  onDataSubmitted,
}) => {
  const [formData, setFormData] =
    useState<typeof initialFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal state for phone/email
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState(initialContactData);

  // Use the global data context
  const { setData } = useData();

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateContactData = (field: string, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    // Required fields
    const requiredFields = [
      "name",
      "age",
      "gender",
      "height",
      "weight",
      "activity_level",
      "goal",
      "diet_preference",
      "target_duration_months",
      "monthly_budget_inr",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return `Please fill in the required field: ${field.replace(/_/g, " ")}`;
      }
    }
    // Numeric validations
    const age = Number(formData.age);
    if (isNaN(age) || age < 10 || age > 100)
      return "Age must be between 10 and 100";
    const height = Number(formData.height);
    if (isNaN(height) || height < 50 || height > 300)
      return "Height must be between 50 and 300 cm";
    const weight = Number(formData.weight);
    if (isNaN(weight) || weight < 20 || weight > 300)
      return "Weight must be between 20 and 300 kg";
    const target_duration_months = Number(formData.target_duration_months);
    if (
      isNaN(target_duration_months) ||
      target_duration_months < 1 ||
      target_duration_months > 6
    )
      return "Target duration must be between 1 and 6 months";
    const monthly_budget_inr = Number(formData.monthly_budget_inr);
    if (isNaN(monthly_budget_inr) || monthly_budget_inr < 0)
      return "Monthly budget must be 0 or more";
    if (
      formData.workout_days_per_week &&
      (Number(formData.workout_days_per_week) < 1 ||
        Number(formData.workout_days_per_week) > 7)
    )
      return "Workout days per week must be between 1 and 7";
    return null;
  };

  // Validate phone and email
  const validateContact = () => {
    if (!contactData.phone.trim()) {
      return "Please enter your phone number.";
    }
    // Simple phone validation (10 digits)
    if (!/^\d{10}$/.test(contactData.phone.trim())) {
      return "Phone number must be 10 digits.";
    }
    if (!contactData.email.trim()) {
      return "Please enter your email address.";
    }
    // Simple email validation
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        contactData.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  // Instead of submitting directly, open the modal for phone/email
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast({
        title: "Missing or invalid information",
        description: error,
        variant: "destructive",
      });
      return;
    }
    setShowContactModal(true);
  };

  // This is called after phone/email is entered and submitted
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateContact();
    if (error) {
      toast({
        title: "Missing or invalid information",
        description: error,
        variant: "destructive",
      });
      return;
    }

    // Parse allergies and health_conditions as arrays (comma separated)
    const allergies =
      formData.allergies && formData.allergies.trim().length > 0
        ? formData.allergies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    const health_conditions =
      formData.health_conditions && formData.health_conditions.trim().length > 0
        ? formData.health_conditions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const user: ManualPlanInputUser = {
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender as ManualPlanInputUser["gender"],
      height_cm: Number(formData.height),
      weight_kg: Number(formData.weight),
      activity_level:
        formData.activity_level as ManualPlanInputUser["activity_level"],
      goal: formData.goal as ManualPlanInputUser["goal"],
      diet_preference:
        formData.diet_preference as ManualPlanInputUser["diet_preference"],
      allergies,
      health_conditions,
      preferred_workout_time: formData.preferred_workout_time
        ? (formData.preferred_workout_time as ManualPlanInputUser["preferred_workout_time"])
        : undefined,
      workout_days_per_week: formData.workout_days_per_week
        ? Number(formData.workout_days_per_week)
        : undefined,
      target_duration_months: Number(formData.target_duration_months),
      monthly_budget_inr: Number(formData.monthly_budget_inr),
      phone: contactData.phone.trim(),
      email: contactData.email.trim(),
    };

    const data: ManualPlanInput = {
      input_type: "manual",
      user,
    };

    setIsSubmitting(true);

    try {
      // Send data to the API
      const response = await fetch(
        "https://n8n.wolvesandcompany.in/webhook/gg-nutritional-calculator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to submit data to the nutritional calculator API."
        );
      }

      // Await and parse the response JSON
      const result = await response.json();
      console.log("🚀 ~ handleSubmit ~ result:", result);

      // Store the result in the global data context
      setData(result);

      onDataSubmitted(data);
      toast({
        title: "Data submitted successfully!",
        description: "Generating your personalized fitness plan...",
      });
      setFormData(initialFormData);
      setContactData(initialContactData);
      setShowContactModal(false);
    } catch (err: any) {
      toast({
        title: "API Error",
        description: err?.message || "Failed to submit data to the API.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Manual Input
          </CardTitle>
          <CardDescription>
            Enter your details manually to generate a personalized fitness plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min={10}
                  max={100}
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateFormData("gender", value)}
                  required
                  disabled={isSubmitting}
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
              <div className="space-y-2">
                <Label htmlFor="diet_preference">Diet Preference *</Label>
                <Select
                  value={formData.diet_preference}
                  onValueChange={(value) =>
                    updateFormData("diet_preference", value)
                  }
                  required
                  disabled={isSubmitting}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  min={50}
                  max={300}
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => updateFormData("height", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min={20}
                  max={300}
                  step="0.1"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity_level">Activity Level *</Label>
                <Select
                  value={formData.activity_level}
                  onValueChange={(value) =>
                    updateFormData("activity_level", value)
                  }
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">
                      Sedentary (little or no exercise)
                    </SelectItem>
                    <SelectItem value="lightly_active">
                      Lightly Active (1-3 days/week)
                    </SelectItem>
                    <SelectItem value="moderately_active">
                      Moderately Active (3-5 days/week)
                    </SelectItem>
                    <SelectItem value="very_active">
                      Very Active (6-7 days/week)
                    </SelectItem>
                    <SelectItem value="extra_active">
                      Extra Active (very hard exercise)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Fitness Goal *</Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => updateFormData("goal", value)}
                  required
                  disabled={isSubmitting}
                >
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_duration_months">
                  Target Duration (months) *
                </Label>
                <Select
                  value={formData.target_duration_months}
                  onValueChange={(value) =>
                    updateFormData("target_duration_months", value)
                  }
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="2">2 months</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="4">4 months</SelectItem>
                    <SelectItem value="5">5 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_budget_inr">
                  Monthly Budget (INR) *
                </Label>
                <Input
                  id="monthly_budget_inr"
                  type="number"
                  min={0}
                  placeholder="1000"
                  value={formData.monthly_budget_inr}
                  onChange={(e) =>
                    updateFormData("monthly_budget_inr", e.target.value)
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_workout_time">
                  Preferred Workout Time
                </Label>
                <Select
                  value={formData.preferred_workout_time}
                  onValueChange={(value) =>
                    updateFormData("preferred_workout_time", value)
                  }
                  disabled={isSubmitting}
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
              <div className="space-y-2">
                <Label htmlFor="workout_days_per_week">Workout Days/Week</Label>
                <Input
                  id="workout_days_per_week"
                  type="number"
                  min={1}
                  max={7}
                  placeholder="3"
                  value={formData.workout_days_per_week}
                  onChange={(e) =>
                    updateFormData("workout_days_per_week", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies (comma separated)</Label>
                <Input
                  id="allergies"
                  type="text"
                  placeholder="e.g. peanuts, gluten or NA"
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="health_conditions">
                  Health Conditions (comma separated)
                </Label>
                <Input
                  id="health_conditions"
                  type="text"
                  placeholder="e.g. diabetes, asthma or NA"
                  value={formData.health_conditions}
                  onChange={(e) =>
                    updateFormData("health_conditions", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              <Target className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Generate Fitness Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Modal
        open={showContactModal}
        onClose={() => !isSubmitting && setShowContactModal(false)}
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Contact Details</h2>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="10 digit phone number"
              value={contactData.phone}
              onChange={(e) => updateContactData("phone", e.target.value)}
              required
              disabled={isSubmitting}
              maxLength={10}
              pattern="\d{10}"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={contactData.email}
              onChange={(e) => updateContactData("email", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isSubmitting && setShowContactModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="inline-block mr-2 animate-spin">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-loader-2"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M22 12a10 10 0 0 1-10 10" />
                    </svg>
                  </span>
                  Submitting...
                </>
              ) : (
                "Submit & Generate"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
