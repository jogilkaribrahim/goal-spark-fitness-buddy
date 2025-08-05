import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ViewFitnessGoal } from "./components/ViewFitnessGoal";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const FetchWrapper = () => {
  const { id } = useParams(); // <-- now using path param
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No plan ID provided in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`https://n8n.wolvesandcompany.in/webhook/get-fitness-plan?id=${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch fitness plan.");
        }
        const data = await res.json();
        if (
          data &&
          typeof data.summary === "string" &&
          Array.isArray(data.workout_plan) &&
          Array.isArray(data.diet_plan)
        ) {
          setPlanData(data);
        } else if (
          data &&
          data.data &&
          typeof data.data.summary === "string" &&
          Array.isArray(data.data.workout_plan) &&
          Array.isArray(data.data.diet_plan)
        ) {
          setPlanData(data.data);
        } else {
          throw new Error("Invalid plan data received from API.");
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to fetch plan data."
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ViewFitnessGoal
      id={id}
      planData={planData}
      loading={loading}
      error={error}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/view/:id" element={<FetchWrapper />} />{" "}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
