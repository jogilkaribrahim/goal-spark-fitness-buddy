import React, { useState } from "react";
import { Calculator, Target, Calendar, DollarSign } from "lucide-react";
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

interface ManualInputProps {
  onDataSubmitted: (data: any) => void;
}

export const ManualInput: React.FC<ManualInputProps> = ({
  onDataSubmitted,
}) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    targetWeight: "",
    goal: "",
    duration: "",
    budget: "",
    currency: "INR",
    units: "metric",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.height ||
      !formData.weight ||
      !formData.goal ||
      !formData.duration
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const targetWeight = formData.targetWeight
      ? parseFloat(formData.targetWeight)
      : weight;

    // Calculate BMI
    const heightInMeters =
      formData.units === "metric" ? height / 100 : height * 0.0254;
    const weightInKg = formData.units === "metric" ? weight : weight * 0.453592;
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    const data = {
      height: formData.units === "metric" ? height : height * 2.54,
      weight: formData.units === "metric" ? weight : weight * 0.453592,
      targetWeight:
        formData.units === "metric" ? targetWeight : targetWeight * 0.453592,
      bmi: parseFloat(bmi.toFixed(1)),
      goal: formData.goal,
      duration: parseInt(formData.duration),
      budget: formData.budget ? parseFloat(formData.budget) : 0,
      currency: formData.currency,
      source: "manual",
    };

    onDataSubmitted(data);
    toast({
      title: "Data submitted successfully!",
      description: "Generating your personalized fitness plan...",
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              <Label htmlFor="units">Units</Label>
              <Select
                value={formData.units}
                onValueChange={(value) => updateFormData("units", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm/kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (in/lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height *</Label>
              <Input
                id="height"
                type="number"
                placeholder={formData.units === "metric" ? "176" : "69"}
                value={formData.height}
                onChange={(e) => updateFormData("height", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.units === "metric" ? "in centimeters" : "in inches"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Current Weight *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder={formData.units === "metric" ? "92" : "203"}
                value={formData.weight}
                onChange={(e) => updateFormData("weight", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.units === "metric" ? "in kilograms" : "in pounds"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal *</Label>
              <Select
                value={formData.goal}
                onValueChange={(value) => updateFormData("goal", value)}
                required
              >
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

            <div className="space-y-2">
              <Label htmlFor="target-weight">Target Weight</Label>
              <Input
                id="target-weight"
                type="number"
                step="0.1"
                placeholder={formData.units === "metric" ? "80" : "176"}
                value={formData.targetWeight}
                onChange={(e) => updateFormData("targetWeight", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {formData.units === "metric" ? "in kilograms" : "in pounds"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Goal Duration *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => updateFormData("duration", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="120">120 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.currency}
                  onValueChange={(value) => updateFormData("currency", value)}
                >
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
                  value={formData.budget}
                  onChange={(e) => updateFormData("budget", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full">
            <Target className="w-4 h-4 mr-2" />
            Generate Fitness Plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
