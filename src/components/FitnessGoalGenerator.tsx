import React from "react";
import { Activity, Target, Calendar, TrendingUp } from "lucide-react";
import { useData } from "@/hooks/get-fitness-data";
import { generatePDF } from "../lib/pdfGenerator";

// Types for plan data
type Exercise = {
  name: string;
  repetitions?: string;
  duration_minutes?: number;
  sets?: number;
  type?: string;
};

type WorkoutDay = {
  day: string;
  exercises: Exercise[];
};

type DietMeals = {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
};

type DietDay = {
  day: string;
  meals: DietMeals;
};

type PlanData = {
  summary: string;
  workout_plan: WorkoutDay[];
  diet_plan: DietDay[];
};

export const FitnessGoalGenerator: React.FC = () => {
  const data = useData();

  // Defensive checks for data structure
  let planData: PlanData | null = null;

  // Check if data and data.data exist and have the required properties
  if (
    data &&
    data.data &&
    typeof data.data === "object" &&
    data.data !== null &&
    typeof data.data.summary === "string"
  ) {
    planData = {
      summary: data.data.summary,
      workout_plan: Array.isArray(data.data.workout_plan)
        ? data.data.workout_plan
        : [],
      diet_plan: Array.isArray(data.data.diet_plan) ? data.data.diet_plan : [],
    };
  }

  // Helper to check if plan details are present
  const hasPlanDetails =
    planData &&
    Array.isArray(planData.workout_plan) &&
    planData.workout_plan.length > 0 &&
    Array.isArray(planData.diet_plan) &&
    planData.diet_plan.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow space-y-6">
        {/* Always visible summary section */}
        <div className="bg-gradient-hero text-white p-6 rounded-lg shadow-fitness">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Your Fitness Journey</h2>
          </div>
          {planData && planData.summary ? (
            <p className="text-lg leading-relaxed">{planData.summary}</p>
          ) : (
            <span className="italic text-muted-foreground">No Summary</span>
          )}
        </div>

        {/* LOCKED SECTION (blurred when plan details are not present) */}
        <div className="relative">
          <div
            className={`transition-filter duration-300 ${
              !hasPlanDetails ? "blur-sm pointer-events-none select-none" : ""
            }`}
          >
            {/* Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workout Plan */}
              <div className="bg-card p-6 rounded-lg shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">
                    Workout Plan (Weekly)
                  </h3>
                </div>
                <div className="text-muted-foreground">
                  <ul className="space-y-3">
                    {planData &&
                    Array.isArray(planData.workout_plan) &&
                    planData.workout_plan.length > 0 ? (
                      planData.workout_plan.map((day) => (
                        <li key={day.day}>
                          {Array.isArray(day.exercises) &&
                            day.exercises.length > 0 && (
                              <span className="font-semibold text-primary">
                                {day.day}:
                              </span>
                            )}
                          <ul className="ml-4 mt-1 space-y-1">
                            {Array.isArray(day.exercises) &&
                              day.exercises.map((ex, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="inline-block w-2 h-2 mt-2 bg-primary rounded-full" />
                                  <span>
                                    <span className="font-medium">
                                      {ex.name || (
                                        <span className="italic text-muted-foreground">
                                          No Name
                                        </span>
                                      )}
                                    </span>
                                    {ex.repetitions &&
                                      ex.repetitions !== "N/A" && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                          ({ex.repetitions})
                                        </span>
                                      )}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))
                    ) : (
                      <li className="italic text-muted-foreground">
                        No workout plan available.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Diet Plan */}
              <div className="bg-card p-6 rounded-lg shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-semibold">
                    Sample Diet Plan{" "}
                    <span className="text-base font-normal text-muted-foreground">
                      (7 Days)
                    </span>
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 border-b border-border text-left">
                          Day
                        </th>
                        <th className="p-2 border-b border-border text-left">
                          Breakfast
                        </th>
                        <th className="p-2 border-b border-border text-left">
                          Lunch
                        </th>
                        <th className="p-2 border-b border-border text-left">
                          Snacks
                        </th>
                        <th className="p-2 border-b border-border text-left">
                          Dinner
                        </th>
                      </tr>
                    </thead>
                    {planData &&
                    Array.isArray(planData.diet_plan) &&
                    planData.diet_plan.length > 0 ? (
                      <tbody>
                        {planData.diet_plan.map((day, idx) => (
                          <tr
                            key={day.day}
                            className={`transition-colors duration-150 ${
                              idx % 2 === 1 ? "bg-muted/30" : ""
                            } hover:bg-primary/10`}
                          >
                            <td className="p-2 border-b border-border font-semibold whitespace-nowrap">
                              <span className="inline-flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                                {day.day}
                              </span>
                            </td>
                            <td className="p-2 border-b border-border max-w-xs text-primary font-medium">
                              {day.meals?.breakfast || (
                                <span className="italic text-muted-foreground">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="p-2 border-b border-border max-w-xs text-green-700 font-medium">
                              {day.meals?.lunch || (
                                <span className="italic text-muted-foreground">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="p-2 border-b border-border max-w-xs text-yellow-700 font-medium">
                              {day.meals?.snacks || (
                                <span className="italic text-muted-foreground">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="p-2 border-b border-border max-w-xs text-blue-700 font-medium">
                              {day.meals?.dinner || (
                                <span className="italic text-muted-foreground">
                                  -
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center italic text-muted-foreground p-4"
                          >
                            No diet plan available.
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>

            {/* Weekly Workout Breakdown */}
            <div className="bg-card p-6 rounded-lg shadow-card mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">
                  Weekly Workout Breakdown
                </h3>
              </div>
              {planData &&
              Array.isArray(planData.workout_plan) &&
              planData.workout_plan.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {planData.workout_plan.map(
                    (day) =>
                      Array.isArray(day.exercises) &&
                      day.exercises.length > 0 && (
                        <div
                          key={day.day}
                          className="border border-border p-4 rounded-lg"
                        >
                          <h4 className="font-semibold text-primary mb-2">
                            {day.day}
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {day.exercises.map((ex, i) => (
                              <li key={i}>
                                <span className="font-medium">
                                  {ex.name || (
                                    <span className="italic text-muted-foreground">
                                      No Name
                                    </span>
                                  )}
                                </span>
                                {ex.repetitions && ex.repetitions !== "N/A" && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({ex.repetitions})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                  )}
                </div>
              ) : (
                <div className="italic text-muted-foreground">
                  No weekly workout breakdown available.
                </div>
              )}
            </div>
          </div>

          {/* Overlay message and blur effect if plan details are not present */}
          {!hasPlanDetails && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg z-20">
              <div className="absolute top-28">
                <h2 className="text-xl font-semibold mb-2 ">
                  Your personalized plan has been mailed to you.
                </h2>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Please check your email for the full details.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
