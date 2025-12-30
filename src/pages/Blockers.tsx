import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import SpriteCarousel from "@/components/SpriteCarousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, Lightbulb, Users, Circle } from "lucide-react";
import Seo from "@/components/Seo";
import { teammates } from "@/data/teammates";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useFormValidation } from "@/hooks/useFormValidation";
import NavigationBar from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Blockers = () => {
  const { formData, updateFormData } = useFormPersistence();
  const navigate = useNavigate();
  
  const { errors, markFieldTouched } = useFormValidation(formData, {
    blockerText: { required: true },
    inventText: { required: true },
    peopleBlockerText: { required: true }
  });

  // Mark all fields as touched when user tries to continue
  const handleContinue = () => {
    if (!isFormValid()) {
      markFieldTouched('blockerText');
      markFieldTouched('inventText');
      markFieldTouched('peopleBlockerText');
    }
  };
  
  const {
    blockerText,
    selectedTags,
    inventText,
    peopleBlockerText,
    selectedTeammates,
    teammateSpecificFeedback,
    selectedBlockerTagsByTeammate
  } = formData;
  const blockerTags = [{
    id: "process",
    text: "Process",
    color: "bg-blue-500"
  }, {
    id: "tools",
    text: "Tools or access",
    color: "bg-green-500"
  }, {
    id: "dependencies",
    text: "Dependencies on others",
    color: "bg-yellow-500"
  }, {
    id: "decisions",
    text: "Slow or unclear decisions",
    color: "bg-orange-500"
  }, {
    id: "scope",
    text: "Scope changing mid-stream",
    color: "bg-red-500"
  }, {
    id: "other",
    text: "Other",
    color: "bg-purple-500"
  }];

  // Challenge areas for teammate feedback
  const blockerFeedbackTags = [{
    id: "ownership",
    text: "Ownership & accountability",
    color: "bg-red-500"
  }, {
    id: "reliability",
    text: "Reliability & follow-through",
    color: "bg-orange-500"
  }, {
    id: "responsiveness",
    text: "Responsiveness & availability",
    color: "bg-yellow-500"
  }, {
    id: "communication",
    text: "Communication clarity & tone",
    color: "bg-purple-500"
  }, {
    id: "context",
    text: "Context & documentation",
    color: "bg-blue-500"
  }, {
    id: "handoffs",
    text: "Handoffs & collaboration",
    color: "bg-green-500"
  }, {
    id: "meetings",
    text: "Meeting hygiene",
    color: "bg-pink-500"
  }, {
    id: "process",
    text: "Process discipline",
    color: "bg-indigo-500"
  }, {
    id: "skills",
    text: "Skill & knowledge readiness",
    color: "bg-cyan-500"
  }, {
    id: "respect",
    text: "Respect, credit & psychological safety",
    color: "bg-violet-500"
  }];
  const criticalityOptions = [{
    id: "low",
    label: "Low",
    color: "bg-green-500",
    example: "Minor inconvenience"
  }, {
    id: "medium",
    label: "Medium",
    color: "bg-yellow-500",
    example: "Slows progress"
  }, {
    id: "high",
    label: "High",
    color: "bg-orange-500",
    example: "Blocks key work"
  }, {
    id: "critical",
    label: "Critical",
    color: "bg-red-500",
    example: "Launch blocked > 3 days"
  }];
  const handleTagClick = (tag: { id: string; text: string }) => {
    const tagText = tag.text;
    const newBlockerText = blockerText ? blockerText + "\n\n" + tagText : tagText;
    
    // Track selected quick tags
    const newTags = selectedTags.includes(tag.id) 
      ? selectedTags 
      : [...selectedTags, tag.id];
    
    updateFormData({
      blockerText: newBlockerText,
      selectedTags: newTags
    });
  };
  
  const toggleTeammate = (teammateId: string) => {
    const newTeammates = selectedTeammates.includes(teammateId)
      ? selectedTeammates.filter(id => id !== teammateId)
      : [...selectedTeammates, teammateId];
    
    // Clean up blocker tags for removed teammates
    const newSelectedBlockerTagsByTeammate = { ...selectedBlockerTagsByTeammate };
    if (!newTeammates.includes(teammateId)) {
      delete newSelectedBlockerTagsByTeammate[teammateId];
    }
    
    updateFormData({ 
      selectedTeammates: newTeammates,
      selectedBlockerTagsByTeammate: newSelectedBlockerTagsByTeammate
    });
  };

  const toggleBlockerTag = (teammateId: string, tagId: string) => {
    const currentTags = selectedBlockerTagsByTeammate[teammateId] || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    updateFormData({
      selectedBlockerTagsByTeammate: {
        ...selectedBlockerTagsByTeammate,
        [teammateId]: newTags
      }
    });
  };

  const updateTeammateFeedback = (teammateId: string, feedback: string) => {
    updateFormData({
      teammateSpecificFeedback: {
        ...teammateSpecificFeedback,
        [teammateId]: feedback
      }
    });
  };

  // Validation function to check if all fields are properly filled
  const isFormValid = () => {
    // Check if all main text fields are filled
    const hasBlockerText = blockerText?.trim().length > 0;
    const hasInventText = inventText?.trim().length > 0;
    const hasPeopleBlockerText = peopleBlockerText?.trim().length > 0;
    
    // Check if at least one tag is selected
    const hasSelectedTags = selectedTags?.length > 0;
    
    // If teammates are selected, check if all have at least one blocker tag
    const hasRequiredBlockerTags = selectedTeammates?.length === 0 || 
      selectedTeammates?.every(teammateId => 
        (selectedBlockerTagsByTeammate?.[teammateId] || []).length > 0
      );
    
    return hasBlockerText && hasInventText && hasPeopleBlockerText && 
           hasSelectedTags && hasRequiredBlockerTags;
  };

  // Auto-navigation removed - users navigate manually
  return <div className="min-h-screen">
      <Seo title="Blockers & Fixes | QPT Culture Pulse" description="Anonymous yearly culture pulse - Report blockers, suggest improvements, and identify friction points." canonicalPath="/blockers" />
      
      <NavigationBar currentStep="blockers" />
      
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
            <h1 className="text-4xl font-bold mb-4">Blockers & Fixes</h1>
            <p className="text-lg text-muted-foreground">
              Name the dragons so we can slay them
            </p>
          </div>

          {/* What slowed you down */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3 card-premium animate-slide-up">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                What slowed you down?
              </h3>
              <Textarea 
                value={blockerText} 
                onChange={e => {
                  updateFormData({ blockerText: e.target.value });
                  markFieldTouched('blockerText');
                }}
                onBlur={() => markFieldTouched('blockerText')}
                placeholder="Describe the specific friction, blocker, or inefficiency you encountered..." 
                className={`min-h-[300px] resize-none ${errors.blockerText ? 'border-destructive' : ''}`}
              />
              {errors.blockerText && (
                <p className="text-sm text-destructive mt-1">{errors.blockerText}</p>
              )}
            </div>

            <div className="lg:col-span-2 card-premium animate-slide-up" style={{
            animationDelay: '0.1s'
          }}>
              <h4 className="font-semibold mb-3">Quick tags</h4>
              <div className="space-y-2">
                {blockerTags.map(tag => {
                  const isSelected = blockerText.includes(tag.text);
                  return (
                    <Button 
                      key={tag.id} 
                      variant={isSelected ? "default" : "outline"} 
                      size="sm" 
                      className={`w-full justify-start text-left transition-all duration-200 ${isSelected ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-md' : 'hover:bg-primary/5 border-border hover:border-primary/50 hover:shadow-md'}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      <Circle className={`w-3 h-3 mr-2 flex-shrink-0 ${isSelected ? 'fill-current' : ''}`} />
                      <span className="truncate">{tag.text}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* What do you wish we had more of? */}
          <div className="card-premium mb-8 animate-slide-up" style={{
          animationDelay: '0.2s'
        }}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              What do you wish we had more of?
            </h3>
            <Textarea 
              value={inventText} 
              onChange={e => {
                updateFormData({ inventText: e.target.value });
                markFieldTouched('inventText');
              }}
              onBlur={() => markFieldTouched('inventText')}
              placeholder="Resources, support, clarity, tools, time, processes..." 
              className={`resize-none min-h-[200px] placeholder:text-primary/60 ${errors.inventText ? 'border-destructive' : ''}`}
            />
            {errors.inventText && (
              <p className="text-sm text-destructive mt-1">{errors.inventText}</p>
            )}
          </div>

          {/* People-centric blockers */}
          <div className="card-premium mb-8 animate-slide-up" style={{
            animationDelay: '0.25s'
          }}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              People-centric challenges?
            </h3>
            <Textarea 
              value={peopleBlockerText} 
              onChange={e => {
                updateFormData({ peopleBlockerText: e.target.value });
                markFieldTouched('peopleBlockerText');
              }}
              onBlur={() => markFieldTouched('peopleBlockerText')}
              placeholder="Communication gaps, collaboration challenges, unclear expectations..." 
              className={`min-h-[300px] resize-none ${errors.peopleBlockerText ? 'border-destructive' : ''}`}
            />
            {errors.peopleBlockerText && (
              <p className="text-sm text-destructive mt-1">{errors.peopleBlockerText}</p>
            )}
          </div>

          {/* Team member selection */}
          <div className="space-y-6 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-premium">
              <h3 className="text-xl font-semibold mb-4">Team members</h3>
              <SpriteCarousel
                teammates={teammates.filter(t => t.id !== "sheikh-mohammed-fahim")}
                multiple
                selectedIds={selectedTeammates}
                onChange={(ids) => updateFormData({ selectedTeammates: ids })}
              />
            </div>
          </div>

          {/* Individual teammate feedback areas */}
          {selectedTeammates.length > 0 && (
            <div className="space-y-6 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-lg font-semibold">Specific challenges for selected teammates</h3>
              {selectedTeammates.map(teammateId => {
                const teammate = teammates.find(t => t.id === teammateId);
                if (!teammate) return null;
                
                const selectedBlockerTags = selectedBlockerTagsByTeammate[teammateId] || [];
                const hasAnyTags = selectedBlockerTags.length > 0;
                
                return (
                  <div key={teammateId} className="card-subtle">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={teammate.sprite} alt={teammate.name} />
                        <AvatarFallback className="text-xs">
                          {teammate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-medium">{teammate.name}</h4>
                    </div>
                    
                    {/* Blocker tags selection */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-3">Select challenge areas:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {blockerFeedbackTags.map(tag => (
                          <Button
                            key={tag.id}
                            variant={selectedBlockerTags.includes(tag.id) ? "default" : "outline"}
                            size="sm"
                            className="justify-start h-auto p-2 text-xs"
                            onClick={() => toggleBlockerTag(teammateId, tag.id)}
                          >
                            <Circle className={`w-2 h-2 mr-2 flex-shrink-0 ${selectedBlockerTags.includes(tag.id) ? 'fill-current' : ''}`} />
                            <span className="text-left">{tag.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Optional additional details - only show if tags are selected */}
                    {hasAnyTags && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Additional details (optional):</p>
                        <Textarea
                          value={teammateSpecificFeedback[teammateId] || ''}
                          onChange={(e) => updateTeammateFeedback(teammateId, e.target.value)}
                          placeholder={`Any additional context about challenges with ${teammate.name}...`}
                          className="min-h-[100px] resize-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}


          {/* Navigation */}
          <div className="flex justify-between animate-slide-up" style={{
          animationDelay: '0.5s'
        }}>
            <Link to="/wins">
              <Button variant="outline" className="btn-ghost">
                ← Back to Wins
              </Button>
            </Link>
            {isFormValid() ? (
              <Link to="/culture-pulse">
                <Button className="btn-hero">
                  Continue → Culture Pulse
                </Button>
              </Link>
            ) : (
              <Button className="btn-hero" onClick={handleContinue}>
                Continue → Culture Pulse
                <span className="ml-2 text-xs">(Complete required fields)</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>;
};
export default Blockers;