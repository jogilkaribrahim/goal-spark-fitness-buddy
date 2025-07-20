import React, { useState } from "react";
import {
  Activity,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  BicepsFlexed,
} from "lucide-react";
import Footer from "./Footer";

interface FitnessData {
  height: number;
  weight: number;
  targetWeight?: number;
  bmi: number;
  goal?: string;
  duration?: number;
  budget?: number;
  currency?: string;
  source: "pdf" | "manual";
}

interface FitnessGoalGeneratorProps {
  data: FitnessData;
}

export const FitnessGoalGenerator: React.FC<FitnessGoalGeneratorProps> = ({
  data,
}) => {
  // State for user contact info
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  // Simple email and phone validation
  const validate = () => {
    let valid = true;
    let errs: { email?: string; phone?: string } = {};
    if (!email) {
      errs.email = "Email is required";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errs.email = "Invalid email address";
      valid = false;
    }
    if (!phone) {
      errs.phone = "Phone number is required";
      valid = false;
    } else if (!/^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""))) {
      errs.phone = "Invalid phone number";
      valid = false;
    }
    setErrors(errs);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  // --- Fitness Plan Generation Logic (unchanged) ---
  const generateFitnessPlan = () => {
    const {
      weight,
      targetWeight = weight,
      bmi,
      goal,
      duration = 60,
      budget = 0,
      currency = "USD",
    } = data;

    const weightDifference = targetWeight - weight;
    const weeklyWeightChange = (weightDifference / (duration / 7)).toFixed(1);
    const isWeightLoss = weightDifference < 0;
    const isWeightGain = weightDifference > 0;

    // Determine goal feasibility
    const maxSafeWeightLoss = duration * 0.5; // 0.5kg per week max
    const maxSafeWeightGain = duration * 0.25; // 0.25kg per week max

    const feasible =
      Math.abs(weightDifference) <=
      (isWeightLoss ? maxSafeWeightLoss : maxSafeWeightGain);

    // Generate weekly plan
    const weeks = Math.ceil(duration / 7);
    const weeklyPlan = [];

    for (let week = 1; week <= weeks; week++) {
      const weeklyGoal = isWeightLoss
        ? `Lose ${Math.abs(parseFloat(weeklyWeightChange))}kg`
        : isWeightGain
        ? `Gain ${parseFloat(weeklyWeightChange)}kg`
        : "Maintain current weight";

      const dietPlan = getDietPlan(goal, budget, currency, week);
      const workoutPlan = getWorkoutPlan(goal, budget, week);

      weeklyPlan.push({
        week,
        goal: weeklyGoal,
        diet: dietPlan,
        workout: workoutPlan,
      });
    }

    // Generate recommendations
    const workoutRecommendations = getWorkoutRecommendations(goal, budget);
    const dietTips = getDietTips(goal, isWeightLoss, isWeightGain);
    const estimatedCost = getEstimatedCost(budget, currency);

    // Generate milestones
    const milestones = [];
    const milestonesCount = Math.min(4, Math.floor(weeks / 2));
    for (let i = 1; i <= milestonesCount; i++) {
      const weekNumber = Math.floor((weeks / milestonesCount) * i);
      const expectedWeight = weight + weightDifference * (i / milestonesCount);
      milestones.push(
        `Week ${weekNumber}: ${expectedWeight.toFixed(1)}kg target`
      );
    }

    return {
      summary: `You are currently at ${weight}kg with a BMI of ${bmi}. ${
        targetWeight !== weight
          ? `Based on your goal to reach ${targetWeight}kg in ${duration} days, you need to ${
              isWeightLoss ? "lose" : "gain"
            } ${Math.abs(weightDifference).toFixed(1)}kg.`
          : "Your goal is to maintain your current weight while improving fitness."
      } ${
        feasible
          ? "This goal is realistic and achievable!"
          : "Consider extending your timeline for safer results."
      }`,
      weeklyPlan,
      workoutRecommendations,
      dietTips,
      estimatedMonthlyCost: estimatedCost,
      milestones,
      feasible,
      motivationalQuote: getMotivationalQuote(),
    };
  };

  const getDietPlan = (
    goal: string | undefined,
    budget: number,
    currency: string,
    week: number
  ) => {
    const budgetCategory =
      budget > 200 ? "high" : budget > 100 ? "medium" : "low";

    const dietPlans = {
      "weight-loss": {
        low: "Home-cooked low-carb meals, intermittent fasting, high protein",
        medium: "Meal prep with lean proteins, vegetables, some supplements",
        high: "Professional meal planning, quality supplements, organic foods",
      },
      "muscle-gain": {
        low: "High-protein home meals, eggs, chicken, lentils, oats",
        medium: "Protein powder, meal prep, quality meats and grains",
        high: "Premium protein supplements, professional nutrition plan",
      },
      toning: {
        low: "Balanced home meals, focus on protein and vegetables",
        medium: "Structured meal prep, moderate supplementation",
        high: "Customized nutrition plan, premium ingredients",
      },
    };

    return (
      dietPlans[goal as keyof typeof dietPlans]?.[budgetCategory] ||
      "Balanced nutrition focusing on whole foods and appropriate portions"
    );
  };

  const getWorkoutPlan = (
    goal: string | undefined,
    budget: number,
    week: number
  ) => {
    const budgetCategory =
      budget > 200 ? "high" : budget > 100 ? "medium" : "low";

    const workoutPlans = {
      "weight-loss": {
        low: "45 mins cardio + bodyweight exercises (home workout)",
        medium: "30 mins HIIT + basic gym membership",
        high: "Personal trainer sessions + premium gym access",
      },
      "muscle-gain": {
        low: "Bodyweight strength training + resistance bands",
        medium: "Weight training at gym 4x/week",
        high: "Personal trainer + specialized equipment",
      },
      toning: {
        low: "Pilates videos + light weights at home",
        medium: "Group fitness classes + gym access",
        high: "Personal training + specialized classes",
      },
    };

    return (
      workoutPlans[goal as keyof typeof workoutPlans]?.[budgetCategory] ||
      "30-45 mins mixed cardio and strength training"
    );
  };

  const getWorkoutRecommendations = (
    goal: string | undefined,
    budget: number
  ) => {
    if (budget < 50) {
      return "Focus on free YouTube workouts, bodyweight exercises, and home routines. Walking and running are excellent free cardio options.";
    } else if (budget < 150) {
      return "Consider a basic gym membership or online fitness app subscription. Mix of home and gym workouts for variety.";
    } else {
      return "Invest in personal training sessions or premium fitness programs. Consider specialized equipment for home gym.";
    }
  };

  const getDietTips = (
    goal: string | undefined,
    isWeightLoss: boolean,
    isWeightGain: boolean
  ) => {
    const baseTips =
      "Stay hydrated with 8-10 glasses of water daily. Focus on whole foods and limit processed items.";

    if (isWeightLoss) {
      return (
        baseTips +
        " Create a moderate caloric deficit. Increase protein and fiber intake. Avoid liquid calories."
      );
    } else if (isWeightGain) {
      return (
        baseTips +
        " Increase caloric intake with healthy foods. Focus on protein for muscle building. Eat frequent meals."
      );
    } else {
      return (
        baseTips +
        " Maintain balanced macronutrients. Focus on nutrient-dense foods for overall health."
      );
    }
  };

  const getEstimatedCost = (budget: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₹";

    if (budget === 0) {
      return `${symbol}0 - Free home-based plan`;
    } else if (budget < 50) {
      return `${symbol}${budget} - Budget-friendly home workouts + basic nutrition`;
    } else if (budget < 150) {
      return `${symbol}${budget} - Gym membership + meal prep + supplements`;
    } else {
      return `${symbol}${budget} - Premium fitness plan + personal training + nutrition coaching`;
    }
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "You don't have to be extreme, just consistent 💪",
      "Every workout is a step closer to your goal 🎯",
      "Your body can do it. It's your mind you need to convince 🧠",
      "Progress, not perfection. You've got this! 🌟",
      "The only bad workout is the one you didn't do 🔥",
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const plan = generateFitnessPlan();

  // If not submitted, show contact form
  if (!submitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="max-w-lg mx-auto bg-card p-8 rounded-lg shadow-card space-y-6 mt-8">
            <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
              💪 Get Your Personalized Fitness Plan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-3 py-2 border rounded focus:outline-none ${
                    errors.email ? "border-red-500" : "border-border"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`w-full px-3 py-2 border rounded focus:outline-none ${
                    errors.phone ? "border-red-500" : "border-border"
                  }`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8901"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 transition"
              >
                Show My Fitness Plan
              </button>
            </form>
            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. Your contact info is only used to
              personalize your experience.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If submitted, show the fitness plan
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow space-y-6">
        {/* Summary Card */}
        <div className="bg-gradient-hero text-white p-6 rounded-lg shadow-fitness">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Your Fitness Journey</h2>
          </div>
          <p className="text-lg leading-relaxed">{plan.summary}</p>
          {!plan.feasible && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-100 font-medium">
                ⚠️ Consider a longer timeline for safer, more sustainable
                results
              </p>
            </div>
          )}
        </div>

        {/* Plan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Workout Plan</h3>
            </div>
            <p className="text-muted-foreground">
              {plan.workoutRecommendations}
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold">Nutrition Guide</h3>
            </div>
            <p className="text-muted-foreground">{plan.dietTips}</p>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="bg-card p-6 rounded-lg shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Weekly Breakdown</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.weeklyPlan.slice(0, 6).map((week) => (
              <div
                key={week.week}
                className="border border-border p-4 rounded-lg"
              >
                <h4 className="font-semibold text-primary mb-2">
                  Week {week.week}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Goal:</span> {week.goal}
                  </div>
                  <div>
                    <span className="font-medium">Diet:</span> {week.diet}
                  </div>
                  <div>
                    <span className="font-medium">Workout:</span> {week.workout}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold">Key Milestones</h3>
            </div>
            <ul className="space-y-2">
              {plan.milestones.map((milestone, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">{milestone}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h3 className="text-xl font-semibold">Monthly Investment</h3>
            </div>
            <div className="text-2xl font-bold text-green-500 mb-2">
              {plan.estimatedMonthlyCost}
            </div>
            <p className="text-muted-foreground text-sm">
              Budget-optimized plan tailored to your financial goals
            </p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-accent text-white p-6 rounded-lg shadow-fitness text-center">
          <p className="text-xl font-semibold">{plan.motivationalQuote}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};
