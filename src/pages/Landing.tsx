import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import Seo from "@/components/Seo";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
const Landing = () => {
  const { theme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [forceOpen, setForceOpen] = useState<boolean>(localStorage.getItem('qpt-open-override') === 'true');
  const [countdown, setCountdown] = useState<string | null>(null);
  const [closingSoon, setClosingSoon] = useState(false);

  // Get current day for schedule awareness
  const today = new Date().getDay();
  const currentDay = today === 2 ? "Tuesday" : today === 3 ? "Wednesday" : today === 4 ? "Thursday" : "Off-cycle";
  const dayMood = {
    Tuesday: {
      emoji: "✨",
      copy: "Let's spark some magic!",
      color: "text-green-400"
    },
    Wednesday: {
      emoji: "⚡",
      copy: "Keep the momentum going!",
      color: "text-blue-400"
    },
    Thursday: {
      emoji: "🎯",
      copy: "Final push - let's make it count!",
      color: "text-orange-400"
    },
    "Off-cycle": {
      emoji: "💤",
      copy: "Culture Pulse is closed",
      color: "text-muted-foreground"
    }
  };
  const mood = dayMood[currentDay as keyof typeof dayMood];
  const isOpen = currentDay !== "Off-cycle" || forceOpen;

  // Countdown to next open/close window (client-side only)
  useEffect(() => {
    if (forceOpen) {
      // testing override: don't show countdown
      setCountdown(null);
      return;
    }
    const getNextOpen = () => {
      const now = new Date();
      let days = (2 - now.getDay() + 7) % 7; // next Tuesday
      if (days === 0 && now.getHours() >= 9) days = 7;
      const target = new Date(now);
      target.setDate(now.getDate() + days);
      target.setHours(9, 0, 0, 0);
      return target;
    };
    const getClose = () => {
      const now = new Date();
      const target = new Date(now);
      let days = (4 - now.getDay() + 7) % 7; // Thursday
      target.setDate(now.getDate() + days);
      target.setHours(18, 0, 0, 0);
      if (target < now) target.setDate(target.getDate() + 7);
      return target;
    };
    const format = (ms: number) => {
      const d = Math.floor(ms / 86400000);
      const h = Math.floor(ms % 86400000 / 3600000);
      const m = Math.floor(ms % 3600000 / 60000);
      const s = Math.floor(ms % 60000 / 1000);
      const parts = [] as string[];
      if (d) parts.push(`${d}d`);
      if (h || d) parts.push(`${h}h`);
      parts.push(`${m}m`, `${s}s`);
      return parts.join(" ");
    };
    const update = () => {
      const now = new Date();
      const openNow = currentDay !== "Off-cycle";
      const target = openNow ? getClose() : getNextOpen();
      setClosingSoon(openNow);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown(null);
      } else {
        setCountdown(format(diff));
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [currentDay, forceOpen]);
  return <div className="min-h-screen relative overflow-hidden">
      <Seo title="Year in Review — QPT Culture Pulse" description="A year is a lot of decisions, conversations, trade-offs, and small moments that add up. This review is a chance to pause, zoom out, and reflect on how things actually felt while the work was happening." canonicalPath="/" />

      {/* Version badge and theme toggle */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <Badge variant="outline" className="px-3 py-1 font-semibold glass-panel">
          v1
        </Badge>
      </div>

      <div className="container mx-auto px-4 relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12 animate-slide-up">
            <div className="mb-8">
              <img 
                src={theme === "dark" ? logoDark : logoLight} 
                alt="QPT Company Logo" 
                className="h-20 mx-auto mb-6 object-contain"
              />
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Year in Review
            </h1>
            <p className="text-2xl text-muted-foreground mb-2">
              QPT's Yearly Culture Pulse
            </p>
          </div>

          {/* Intro copy */}
          <div className="mb-12 animate-slide-up" style={{
          animationDelay: '0.2s'
        }}>
            <div className="card-premium max-w-3xl mx-auto">
              <p className="text-lg leading-relaxed text-foreground">
                A year is a lot of decisions, conversations, trade-offs, and small moments that add up.
              </p>
              <p className="text-muted-foreground mt-4">
                This review is a chance to pause, zoom out, and reflect on how things actually felt while the work was happening. What helped. What got in the way. What leadership did well. Where we can be sharper next year.
              </p>
            </div>
          </div>

          {/* Info chips */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 animate-slide-up max-w-2xl mx-auto" style={{
          animationDelay: '0.4s'
        }}>
            <div className="card-section group">
              <Clock className="w-6 h-6 text-primary mb-2 mx-auto group-hover:animate-pulse-glow" />
              <h3 className="font-semibold mb-1">8–12 minutes</h3>
              <p className="text-sm text-muted-foreground">Takes about 8–12 minutes</p>
            </div>

            <div className="card-section group">
              <Shield className="w-6 h-6 text-primary mb-2 mx-auto group-hover:animate-pulse-glow" />
              <h3 className="font-semibold mb-1">Complete anonymity</h3>
              <p className="text-sm text-muted-foreground">Your responses are never linked to your identity. Share openly and honestly.</p>
            </div>
          </div>

          {/* Schedule chip */}
          

          {/* CTAs */}
          <div className="flex flex-col items-center gap-6 animate-slide-up" style={{
          animationDelay: '0.8s'
        }}>
          <Link to="/wins">
            <Button className="btn-hero">
              Let's Look Back
            </Button>
          </Link>

          </div>
        </div>
      </div>

    </div>;
};
export default Landing;