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

export const ManualInput: React.FC<ManualInputProps> = ({
  onDataSubmitted,
}) => {
  const [formData, setFormData] =
    useState<typeof initialFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the global data context
  const { setData } = useData();

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
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
              <Label htmlFor="monthly_budget_inr">Monthly Budget (INR) *</Label>
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
  );
};
