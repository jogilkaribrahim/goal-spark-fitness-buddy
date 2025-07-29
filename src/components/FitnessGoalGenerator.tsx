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
import { useData } from "@/hooks/get-fitness-data";
import { generatePDF } from "../lib/pdfGenerator";

export const FitnessGoalGenerator: React.FC = () => {
  const data = useData();
  const planData = data.data.output.data;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const validate = () => {
    let valid = true;
    const errs: { email?: string; phone?: string } = {};
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
    } else if (!/^(\+91[-\s]?)?[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""))) {
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
      setShowForm(false);
    }
  };

  const DownloadButton = ({ planData }) => (
    <button
      onClick={() => generatePDF(planData)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Download Plan PDF
    </button>
  );

  if (!planData) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow space-y-6">
        {/* Always visible summary section */}
        <div className="bg-gradient-hero text-white p-6 rounded-lg shadow-fitness">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Your Fitness Journey</h2>
          </div>
          <p className="text-lg leading-relaxed">{planData.summary}</p>
        </div>

        {/* <div>
          <DownloadButton planData={planData} />
        </div> */}

        {/* LOCKED SECTION (blurred when not submitted) */}
        <div className="relative">
          <div
            className={`transition-filter duration-300 ${
              !submitted ? "blur-sm pointer-events-none select-none" : ""
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
                    {planData.workout_plan.map((day: any) => (
                      <li key={day.day}>
                        {day.exercises.length > 0 && (
                          <span className="font-semibold text-primary">
                            {day.day}:
                          </span>
                        )}
                        <ul className="ml-4 mt-1 space-y-1">
                          {day.exercises.map((ex: any, i: number) => (
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
                      {planData.diet_plan.map((day: any, idx: number) => (
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
                            {day.meals.breakfast}
                          </td>
                          <td className="p-2 border-b border-border max-w-xs text-green-700 font-medium">
                            {day.meals.lunch}
                          </td>
                          <td className="p-2 border-b border-border max-w-xs text-yellow-700 font-medium">
                            {day.meals.snacks}
                          </td>
                          <td className="p-2 border-b border-border max-w-xs text-blue-700 font-medium">
                            {day.meals.dinner}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Weekly Workout Breakdown & Extras */}
            <div className="bg-card p-6 rounded-lg shadow-card mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">
                  Weekly Workout Breakdown
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {planData.workout_plan.map(
                  (day: any) =>
                    day.exercises.length > 0 && (
                      <div
                        key={day.day}
                        className="border border-border p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          {day.day}
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {day.exercises.map((ex: any, i: number) => (
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
          </div>

          {/* Lock Overlay only on the blurred section */}
          {!submitted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Unlock Your Fitness Plan
              </h2>
              <p className="mb-4 text-center text-sm text-gray-600">
                Enter your email & phone to view your full personalized plan
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Unlock Now
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal for form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Unlock Your Plan
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
                    errors.email ? "border-red-500" : "border-gray-300"
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
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
