import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Trophy, AlertTriangle, Heart, MessageSquare, Shield, BarChart3, User } from "lucide-react";
interface NavigationStep {
  id: string;
  title: string;
  path: string;
  order: number;
  icon: any;
}
const navigationSteps: NavigationStep[] = [{
  id: "wins",
  title: "Wins",
  path: "/wins",
  order: 1,
  icon: Trophy
}, {
  id: "blockers",
  title: "Blockers",
  path: "/blockers",
  order: 2,
  icon: AlertTriangle
}, {
  id: "culture-pulse",
  title: "Culture",
  path: "/culture-pulse",
  order: 3,
  icon: BarChart3
}, {
  id: "shoutouts",
  title: "Shoutouts",
  path: "/shoutouts",
  order: 4,
  icon: Heart
}, {
  id: "feedback",
  title: "Yearly Feedback",
  path: "/feedback",
  order: 5,
  icon: MessageSquare
}, {
  id: "culture-protection",
  title: "Protection",
  path: "/culture-protection",
  order: 6,
  icon: Shield
}, {
  id: "review",
  title: "Review",
  path: "/review",
  order: 7,
  icon: User
}];
interface NavigationBarProps {
  currentStep?: string;
  completedSteps?: string[];
}
const NavigationBar = ({
  currentStep,
  completedSteps = []
}: NavigationBarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Auto-detect current step from path if not provided
  const detectedCurrentStep = currentStep || navigationSteps.find(step => step.path === currentPath)?.id;
  const currentStepIndex = navigationSteps.findIndex(step => step.id === detectedCurrentStep);
  const progressValue = currentStepIndex >= 0 ? (currentStepIndex + 1) / navigationSteps.length * 100 : 0;
  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId);
  const isStepCurrent = (stepId: string) => stepId === detectedCurrentStep;
  const isStepAccessible = (stepIndex: number) => {
    // Step is accessible if it's the current step, a completed step, or the next step after current
    return stepIndex <= currentStepIndex + 1 || isStepCompleted(navigationSteps[stepIndex].id);
  };
  return <div className="sticky top-0 z-50 glass-panel border-b w-full">
      <div className="w-full px-4 py-2">
        {/* Compact progress section */}
        

        {/* Compact navigation tabs */}
        <div className="flex gap-1 overflow-x-auto w-full">
          <div className="flex gap-1 w-full justify-center">
            {navigationSteps.map((step, index) => {
            const isCompleted = isStepCompleted(step.id);
            const isCurrent = isStepCurrent(step.id);
            const isAccessible = isStepAccessible(index);
            const IconComponent = step.icon;
            return <div key={step.id} className="flex-1 min-w-0">
                  {isAccessible ? <Link to={step.path}>
                      <div className={`
                          group relative flex items-center justify-center gap-2 px-3 py-2 rounded-[0.4rem] font-medium transition-all duration-300 border text-center
                          ${isCurrent ? "bg-gradient-primary text-primary-foreground shadow-md border-primary/20" : isCompleted ? "card-subtle border-border/50 text-foreground hover:shadow-sm bg-accent/20" : "glass-button text-muted-foreground hover:text-foreground"}
                        `}>
                        <IconComponent className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{step.title}</span>
                        {isCompleted && !isCurrent && <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />}
                      </div>
                    </Link> : <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-[0.4rem] font-medium opacity-40 cursor-not-allowed text-muted-foreground border border-border/30 text-center">
                      <IconComponent className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs truncate">{step.title}</span>
                    </div>}
                </div>;
          })}
          </div>
        </div>
      </div>
    </div>;
};
export default NavigationBar;