import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Zap, Shield, Lightbulb, Heart, Users, Building, Target, Handshake, TrendingUp, Smile } from "lucide-react";
import RatingPills from "@/components/survey/RatingPills";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import NavigationBar from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Seo from "@/components/Seo";
const CulturePulse = () => {
  const [mode] = useState<"3-5">("3-5");
  const navigate = useNavigate();
  const {
    formData,
    updateFormData
  } = useFormPersistence();
  const {
    ratings
  } = formData;
  type Question = {
    id: string;
    text: string;
    definition: string;
    icon: any;
    levelDescriptions: string[];
    leftLabel?: string;
    rightLabel?: string;
  };
  const primaryQuestions: Question[] = [{
    id: "focus",
    text: "Focused on What Matters",
    definition: "Over the year, how often were we focused on the work that truly mattered?",
    icon: Lightbulb,
    leftLabel: "Pulled in too many directions",
    rightLabel: "Strongly focused",
    levelDescriptions: [
      "Pulled in too many directions",
      "Frequently distracted from priorities",
      "Often distracted from priorities",
      "Sometimes focused, sometimes not",
      "Moderately focused on priorities",
      "Mostly focused on priorities",
      "Consistently focused on priorities",
      "Strongly focused on priorities",
      "Very strongly focused on priorities",
      "Strongly focused on the right priorities"
    ]
  }, {
    id: "clarity",
    text: "Clarity & Guidance",
    definition: "Did you usually have the clarity and guidance needed to move work forward?",
    icon: Shield,
    leftLabel: "Rarely",
    rightLabel: "Consistently",
    levelDescriptions: [
      "Rarely had clarity",
      "Very rarely had guidance",
      "Sometimes had guidance",
      "Occasionally had adequate clarity",
      "Adequate clarity most times",
      "Usually clear on direction",
      "Often clear with good guidance",
      "Consistently clear on direction",
      "Very consistently had clarity",
      "Consistently had clarity and guidance"
    ]
  }, {
    id: "safety",
    text: "Psychological Safety",
    definition: "Did you feel respected and valued by the team overall?",
    icon: Users,
    leftLabel: "Rarely",
    rightLabel: "Consistently",
    levelDescriptions: [
      "Rarely felt respected",
      "Very rarely felt valued",
      "Sometimes felt valued",
      "Occasionally felt respected",
      "Neutral experience",
      "Usually felt respected",
      "Often felt respected and valued",
      "Consistently felt respected",
      "Very consistently felt valued",
      "Consistently felt respected and valued"
    ]
  }, {
    id: "sustainability",
    text: "Pace & Sustainability",
    definition: "Looking back, how sustainable did your pace of work feel this year?",
    icon: Clock,
    leftLabel: "Not sustainable",
    rightLabel: "Very sustainable",
    levelDescriptions: [
      "Not sustainable at all",
      "Very unsustainable",
      "Mostly unsustainable",
      "Somewhat unsustainable",
      "Mixed sustainability",
      "Moderately sustainable",
      "Mostly sustainable",
      "Consistently sustainable",
      "Very sustainable pace",
      "Extremely sustainable pace"
    ]
  }, {
    id: "energy",
    text: "Energy & Enjoyment",
    definition: "Did your work mostly drain you or give you energy this year?",
    icon: Heart,
    leftLabel: "Mostly draining",
    rightLabel: "Mostly energizing",
    levelDescriptions: [
      "Mostly draining",
      "Very draining",
      "Often draining",
      "Somewhat draining",
      "Balanced",
      "Somewhat energizing",
      "Often energizing",
      "Very energizing",
      "Mostly energizing",
      "Extremely energizing"
    ]
  }, {
    id: "growth",
    text: "Growth",
    definition: "Did you grow at the pace you expected to this year?",
    icon: Zap,
    leftLabel: "Much slower than expected",
    rightLabel: "Faster than expected",
    levelDescriptions: [
      "Much slower than expected",
      "Very slow compared to expectations",
      "Slower than expected",
      "Somewhat slower than expected",
      "About as expected",
      "Somewhat faster than expected",
      "Faster than expected",
      "Much faster than expected",
      "Significantly faster than expected",
      "Exceeded all expectations"
    ]
  }, {
    id: "transparency",
    text: "Decision Transparency",
    definition: "When decisions affected your work, was the reasoning usually clear?",
    icon: Building,
    leftLabel: "Often confusing",
    rightLabel: "Clear and transparent",
    levelDescriptions: [
      "Often confusing",
      "Very confusing",
      "Sometimes unclear",
      "Occasionally unclear",
      "Neutral",
      "Usually clear",
      "Often clear and transparent",
      "Consistently clear",
      "Very clear and transparent",
      "Clear and transparent"
    ]
  }, {
    id: "motivation",
    text: "Shared Motivation",
    definition: "How motivated did you feel by the team's goals and priorities this year?",
    icon: Target,
    leftLabel: "Not motivating",
    rightLabel: "Highly motivating",
    levelDescriptions: [
      "Not motivating",
      "Very little motivation",
      "Somewhat unmotivating",
      "Occasionally motivating",
      "Neutral",
      "Moderately motivating",
      "Often motivating",
      "Very motivating",
      "Highly motivating",
      "Extremely motivating"
    ]
  }, {
    id: "trust",
    text: "Trust Within the Team",
    definition: "How much trust did you have in the team to do their part well?",
    icon: Handshake,
    leftLabel: "Low trust",
    rightLabel: "High trust",
    levelDescriptions: [
      "Low trust",
      "Very low trust",
      "Somewhat low trust",
      "Occasionally trusting",
      "Neutral",
      "Moderate trust",
      "Good trust",
      "High trust",
      "Very high trust",
      "Extremely high trust"
    ]
  }, {
    id: "confidence",
    text: "Confidence Going Forward",
    definition: "How confident do you feel about this team heading into the next year?",
    icon: TrendingUp,
    leftLabel: "Not confident",
    rightLabel: "Very confident",
    levelDescriptions: [
      "Not confident",
      "Very little confidence",
      "Somewhat unconfident",
      "Occasionally confident",
      "Neutral",
      "Moderately confident",
      "Often confident",
      "Very confident",
      "Highly confident",
      "Extremely confident"
    ]
  }, {
    id: "joy",
    text: "Joy from Work",
    definition: "How much joy did your day-to-day work bring you this year?",
    icon: Smile,
    leftLabel: "Very little joy",
    rightLabel: "A great deal of joy",
    levelDescriptions: [
      "Very little joy",
      "Minimal joy",
      "Somewhat joyless",
      "Occasionally joyful",
      "Neutral",
      "Moderately joyful",
      "Often joyful",
      "Very joyful",
      "A great deal of joy",
      "Extremely joyful"
    ]
  }];
  const coreValues = ["Move Fast, Chase Excellence", "Take Ownership, Deliver Outcomes", "Invent & Simplify", "The Dream Team", "Have Honesty & Integrity", "Debate Openly, Commit Fully", "Product First"];
  const handleRatingChange = (questionId: string, value: number) => {
    updateFormData({
      ratings: {
        ...ratings,
        [questionId]: value
      }
    });
  };

  // Validation function to check if all fields are properly filled
  const isFormValid = () => {
    // Check if all 11 questions are rated (1-10 scale)
    const allQuestionsRated = primaryQuestions.every(question => 
      ratings[question.id] !== undefined && ratings[question.id] >= 1 && ratings[question.id] <= 10
    );
    
    // Check if both strongest and weakest values are selected
    const hasStrongestValue = formData.strongestValue.trim().length > 0;
    const hasWeakestValue = formData.weakestValue.trim().length > 0;
    
    return allQuestionsRated && hasStrongestValue && hasWeakestValue;
  };

  // Auto-navigation removed - users navigate manually
  return <div className="min-h-screen">
      <Seo title="Culture Pulse | QPT Culture Pulse" description="Anonymous yearly culture pulse - Rate team culture and core values." canonicalPath="/culture-pulse" />
      
      <NavigationBar currentStep="culture-pulse" />
      
      {/* Version badge and theme toggle */}
      <div className="absolute top-20 right-6 z-10 flex items-center gap-3">
        <Badge variant="outline" className="px-3 py-1 font-semibold glass-panel">
          v1
        </Badge>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">The Work Experience Pulse</h1>
            <p className="text-lg text-muted-foreground">Looking Back — All questions use a 1–10 scale. There are no right answers. Just your experience.</p>
          </div>

          {/* Ratings - primary */}
          <div className="space-y-6 mb-8">
            {primaryQuestions.map((question, index) => {
            const IconComponent = question.icon;
            const rating = ratings[question.id]; // no default; show description only after selection
            return <Card key={question.id} className="card-premium animate-slide-up" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{question.text}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{question.definition}</p>

                      <RatingPills value={rating} onChange={val => handleRatingChange(question.id, val)} count={10} levelDescriptions={question.levelDescriptions} leftLabel={question.leftLabel} rightLabel={question.rightLabel} leftTone="destructive" rightTone="positive" />

                    </div>
                  </div>
                </Card>;
          })}
          </div>

          {/* Strongest & Weakest */}
          {mode === "3-5" && <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card-premium animate-slide-up" style={{
            animationDelay: '0.7s'
          }}>
                <h3 className="text-lg font-semibold mb-4">Team's strongest value this year</h3>
                <Select value={formData.strongestValue} onValueChange={value => updateFormData({
              strongestValue: value
            })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a core value" />
                  </SelectTrigger>
                  <SelectContent>
                    {coreValues.map(value => <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="card-premium animate-slide-up" style={{
            animationDelay: '0.8s'
          }}>
                <h3 className="text-lg font-semibold mb-4">Team's weakest value this year</h3>
                <Select value={formData.weakestValue} onValueChange={value => updateFormData({
              weakestValue: value
            })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a core value" />
                  </SelectTrigger>
                  <SelectContent>
                    {coreValues.map(value => <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>}

          {/* Navigation */}
          <div className="flex justify-between animate-slide-up" style={{
          animationDelay: '1.1s'
        }}>
            <Link to="/blockers">
              <Button variant="outline" className="btn-ghost">
                ← Back to Blockers
              </Button>
            </Link>
            {isFormValid() ? (
              <Link to="/shoutouts">
                <Button className="btn-hero">
                  Continue → Shoutouts
                </Button>
              </Link>
            ) : (
              <Button className="btn-hero" disabled>
                Continue → Shoutouts
                <span className="ml-2 text-xs">(Complete required fields)</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>;
};
export default CulturePulse;