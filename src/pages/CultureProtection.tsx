import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";
import Seo from "@/components/Seo";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useFormValidation } from "@/hooks/useFormValidation";
import NavigationBar from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CultureProtection = () => {
  const { formData, updateFormData } = useFormPersistence();
  const navigate = useNavigate();
  
  const { cultureText } = formData;

  const { errors, isValid } = useFormValidation(formData, {
    cultureText: { required: true }
  });

  // Auto-navigation removed - users navigate manually

  return (
    <div className="min-h-screen">
      <Seo 
        title="Culture Protection | QPT Culture Pulse" 
        description="Anonymous yearly culture pulse - Share what makes our culture special and worth protecting." 
        canonicalPath="/culture-protection" 
      />
      
      <NavigationBar currentStep="culture-protection" />
      
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
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              Culture Protection
            </h1>
            <p className="text-lg text-muted-foreground">
              What makes QPT special that we must never lose?
            </p>
          </div>

          {/* Main question */}
          <div className="card-premium mb-8 animate-slide-up">
            <h3 className="text-xl font-semibold mb-4">
              What is the best part of our culture that we should protect with everything we have?
            </h3>
            <Textarea
              value={cultureText}
              onChange={(e) => updateFormData({ cultureText: e.target.value })}
              placeholder="What makes QPT special? What should we never lose or change..."
              className={`min-h-[300px] resize-none ${errors.cultureText ? 'border-destructive' : ''}`}
            />
            {errors.cultureText && (
              <p className="text-sm text-destructive mt-1">{errors.cultureText}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/feedback">
              <Button variant="outline" className="btn-ghost">
                ← Back to Yearly Feedback
              </Button>
            </Link>
            {isValid ? (
              <Link to="/review">
                <Button className="btn-hero">
                  Continue → Review
                </Button>
              </Link>
            ) : (
              <Button className="btn-hero" disabled>
                Continue → Review
                {!isValid && <span className="ml-2 text-xs">(Complete required fields)</span>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureProtection;