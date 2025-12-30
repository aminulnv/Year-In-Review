import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles, Users, Trophy, Gift } from "lucide-react";
import { useFormPersistence } from "@/hooks/useFormPersistence";
const Success = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [memeUnlocked, setMemeUnlocked] = useState(false);
  const {
    clearFormData
  } = useFormPersistence();
  const navigate = useNavigate();
  useEffect(() => {
    // Clear form data on success
    clearFormData();
    
    // Trigger confetti animation
    setShowConfetti(true);

    // Check if meme contest is unlocked (≥80% completion or answered at least 1 in each section)
    const completionRate = 100; // Mock - would calculate from actual form data
    setMemeUnlocked(completionRate >= 80);

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  }, [clearFormData]);
  const memeCategories = [{
    id: "real",
    title: "Most Real",
    description: "The truth that hits different"
  }, {
    id: "hilarious",
    title: "Most Hilarious",
    description: "Made everyone actually LOL"
  }, {
    id: "relatable",
    title: "Most Relatable",
    description: "We've all been there..."
  }];
  const prizeOptions = ["Coffee shop gift card ($10)", "Lunch on the company ($15)", "Bookstore credit ($12)"];
  return <div className="min-h-screen relative overflow-hidden">
      {/* Confetti animation */}
      {showConfetti && <div className="absolute inset-0 pointer-events-none z-10">
          {Array.from({
        length: 50
      }).map((_, i) => <div key={i} className="absolute w-2 h-2 bg-primary opacity-80 animate-float" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 3}s`
      }} />)}
        </div>}

      {/* Version badge and theme toggle */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
        <Badge variant="outline" className="px-3 py-1 font-semibold glass-panel">
          v1
        </Badge>
      </div>

      <div className="container mx-auto px-4 relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main celebration */}
          <div className="mb-12 animate-slide-up">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Successful!
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thank you for your time and thoughtful responses.
            </p>
          </div>

          {/* Group celebration visual */}
          

          {/* Action button */}
          <div className="flex justify-center mb-12 animate-slide-up" style={{
          animationDelay: '0.4s'
        }}>
            <Button 
              onClick={() => navigate('/')} 
              className="btn-hero"
            >
              Return to Home
            </Button>
          </div>

        </div>
      </div>
    </div>;
};
export default Success;