import React from "react";
import { Activity, Target, Calendar, TrendingUp } from "lucide-react";
import Footer from "./Footer";

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

export const ViewFitnessGoal: React.FC<{
  id: string | null;
  planData: PlanData | null;
  loading: boolean;
  error: string | null;
}> = ({ id, planData, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg text-muted-foreground">
            Loading your plan...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="text-lg text-destructive mb-2">{error}</div>
          <div className="text-xs text-muted-foreground mb-1">
            <span className="font-semibold">Debug Info:</span>
            <div>
              <span>URL: </span>
              <span className="break-all">{window.location.href}</span>
            </div>
            <div>
              <span>id param: </span>
              <span>
                {id ? id : <span className="text-red-600">[none]</span>}
              </span>
            </div>
            <div className="mt-2 text-amber-700">
              Make sure you are visiting this page with a URL like:
              <br />
              <code className="bg-muted px-2 py-1 rounded">
                /view?id=YOUR_PLAN_ID
              </code>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg text-muted-foreground">
            No plan data found.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow space-y-6">
        {/* Summary Section */}
        <div className="bg-gradient-hero text-white p-6 rounded-lg shadow-fitness">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Your Fitness Journey</h2>
          </div>
          <p className="text-lg leading-relaxed">{planData.summary}</p>
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workout Plan */}
          <div className="bg-card p-6 rounded-lg shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Workout Plan (Weekly)</h3>
            </div>
            <div className="text-muted-foreground">
              <ul className="space-y-3">
                {planData.workout_plan.map((day) => (
                  <li key={day.day}>
                    {day.exercises && day.exercises.length > 0 && (
                      <span className="font-semibold text-primary">
                        {day.day}:
                      </span>
                    )}
                    <ul className="ml-4 mt-1 space-y-1">
                      {day.exercises &&
                        day.exercises.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="inline-block w-2 h-2 mt-2 bg-primary rounded-full" />
                            <span>
                              <span className="font-medium">{ex.name}</span>
                              {ex.repetitions && ex.repetitions !== "N/A" && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({ex.repetitions})
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
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
                        {day.meals?.breakfast || ""}
                      </td>
                      <td className="p-2 border-b border-border max-w-xs text-green-700 font-medium">
                        {day.meals?.lunch || ""}
                      </td>
                      <td className="p-2 border-b border-border max-w-xs text-yellow-700 font-medium">
                        {day.meals?.snacks || ""}
                      </td>
                      <td className="p-2 border-b border-border max-w-xs text-blue-700 font-medium">
                        {day.meals?.dinner || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Weekly Workout Breakdown */}
        <div className="bg-card p-6 rounded-lg shadow-card mt-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Weekly Workout Breakdown</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planData.workout_plan.map(
              (day) =>
                day.exercises &&
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
                          <span className="font-medium">{ex.name}</span>
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
        </div>
      </main>
    </div>
  );
};
