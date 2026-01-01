import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";

import Wins from "./pages/Wins";
import Blockers from "./pages/Blockers";
import CulturePulse from "./pages/CulturePulse";
import Shoutouts from "./pages/Shoutouts";
import Review from "./pages/Review";
import Success from "./pages/Success";
import Feedback from "./pages/Feedback";
import CultureProtection from "./pages/CultureProtection";
import NotFound from "./pages/NotFound";
import YearInReview from "./pages/YearInReview";
import YearInReviewWins from "./pages/year-in-review/YearInReviewWins";
import YearInReviewBlockers from "./pages/year-in-review/YearInReviewBlockers";
import YearInReviewWishMore from "./pages/year-in-review/YearInReviewWishMore";
import YearInReviewPulse from "./pages/year-in-review/YearInReviewPulse";
import YearInReviewPeople from "./pages/year-in-review/YearInReviewPeople";
import YearInReviewLeadership from "./pages/year-in-review/YearInReviewLeadership";
import YearInReviewReview from "./pages/year-in-review/YearInReviewReview";
import YearInReviewSuccess from "./pages/year-in-review/YearInReviewSuccess";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen relative">
            {/* Global overlay for readability */}
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm pointer-events-none" style={{ zIndex: 0 }} />
            <div className="relative" style={{ zIndex: 1 }}>
          <BrowserRouter>
          <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wins" element={<Wins />} />
            <Route path="/blockers" element={<Blockers />} />
            <Route path="/culture-pulse" element={<CulturePulse />} />
            <Route path="/shoutouts" element={<Shoutouts />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/culture-protection" element={<CultureProtection />} />
            <Route path="/review" element={<Review />} />
            <Route path="/success" element={<Success />} />
            <Route path="/year-in-review" element={<YearInReview />} />
            <Route path="/year-in-review/wins" element={<YearInReviewWins />} />
            <Route path="/year-in-review/blockers" element={<YearInReviewBlockers />} />
            <Route path="/year-in-review/wish-more" element={<YearInReviewWishMore />} />
            <Route path="/year-in-review/pulse" element={<YearInReviewPulse />} />
            <Route path="/year-in-review/people" element={<YearInReviewPeople />} />
            <Route path="/year-in-review/leadership" element={<YearInReviewLeadership />} />
            <Route path="/year-in-review/review" element={<YearInReviewReview />} />
            <Route path="/year-in-review/success" element={<YearInReviewSuccess />} />
            <Route path="*" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Routes>
          </BrowserRouter>
            </div>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
