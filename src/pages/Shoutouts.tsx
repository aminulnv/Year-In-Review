import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";
import SpriteCarousel from "@/components/SpriteCarousel";
import { teammates } from "@/data/teammates";
import Seo from "@/components/Seo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import NavigationBar from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Shoutouts = () => {
  const { formData, updateFormData } = useFormPersistence();
  const navigate = useNavigate();
  
  const {
    shoutoutSelectedTeammates,
    selectedImpactByTeammate,
    noteText
  } = formData;

  // Using imported QPT teammates roster (sprites)

  // Ordered and curated impact tags
  const impactTags = [
    { id: "unblocked", text: "Unblocked me", color: "bg-green-500" },
    { id: "context", text: "Shared context", color: "bg-blue-500" },
    { id: "clarity", text: "Gave clarity", color: "bg-teal-500" },
    { id: "ownership", text: "Took ownership", color: "bg-orange-500" },
    { id: "forward", text: "Moved things forward", color: "bg-yellow-500" },
    { id: "standard", text: "Set the standard", color: "bg-pink-500" },
    { id: "bar", text: "Raised the bar", color: "bg-purple-500" },
    { id: "example", text: "Led by example", color: "bg-indigo-500" },
  ];

  const toggleImpactTag = (teammateId: string, tagId: string) => {
    const current = selectedImpactByTeammate[teammateId] ?? [];
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    updateFormData({ 
      selectedImpactByTeammate: { ...selectedImpactByTeammate, [teammateId]: next }
    });
  };

  const hasAnyTags = shoutoutSelectedTeammates.some(
    (id) => (selectedImpactByTeammate[id]?.length ?? 0) > 0
  );

  const isFormValid = () => {
    return shoutoutSelectedTeammates.length > 0 && hasAnyTags;
  };

  // Auto-navigation removed - users navigate manually

  // Selection handled by SpriteCarousel via setSelectedTeammates

  return (
    <div className="min-h-screen">
      <Seo
        title="Shoutouts | QPT Culture Pulse"
        description="Anonymous yearly culture pulse - Recognize teammates and celebrate collaborative achievements."
        canonicalPath="/shoutouts"
      />
      
      <NavigationBar currentStep="shoutouts" />
      
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
              <Heart className="w-10 h-10 text-primary" />
              People Who Made a Difference
            </h1>
            <p className="text-lg text-muted-foreground">Who made your year easier, better, or more effective?</p>
          </div>

          <div className="card-premium mb-8 animate-slide-up">
            <h3 className="text-xl font-semibold mb-6 text-center">Select teammate(s)</h3>
            <SpriteCarousel
              teammates={teammates}
              multiple
              selectedIds={shoutoutSelectedTeammates}
              onChange={(ids) => {
                // prune tag selections to only currently selected teammates
                const pruned: Record<string, string[]> = {};
                ids.forEach((id) => {
                  if (selectedImpactByTeammate[id]?.length) pruned[id] = selectedImpactByTeammate[id];
                });
                
                updateFormData({
                  shoutoutSelectedTeammates: ids,
                  selectedImpactByTeammate: pruned,
                  noteText: ids.length === 0 ? "" : noteText
                });
              }}
            />
          </div>

          {/* Impact tags - per selected teammate */}
          {shoutoutSelectedTeammates.length > 0 && (
            <div
              className="card-premium mb-8 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-xl font-semibold mb-4">How did they help?</h3>
              <div className="space-y-6">
                {shoutoutSelectedTeammates.map((id) => {
                  const tm = teammates.find((t) => t.id === id);
                  if (!tm) return null;
                  const selectedForTm = selectedImpactByTeammate[id] ?? [];
                  return (
                    <div key={id}>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tm.sprite} alt={`${tm.name} avatar`} />
                          <AvatarFallback>{tm.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-medium">{tm.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {impactTags.map((tag) => (
                          <Button
                            key={tag.id}
                            variant={
                              selectedForTm.includes(tag.id) ? "default" : "outline"
                            }
                            className={`h-auto p-4 flex items-center gap-3 ${
                              selectedForTm.includes(tag.id)
                                ? "bg-primary text-primary-foreground shadow-glow"
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() => toggleImpactTag(id, tag.id)}
                          >
                            <div className={`w-3 h-3 rounded-full ${tag.color}`}></div>
                            <span className="font-medium">{tag.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional note */}
          {shoutoutSelectedTeammates.length > 0 && hasAnyTags && (
            <div
              className="card-premium mb-8 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-lg font-semibold mb-4">Add a line? (optional)</h3>
              <Textarea
                value={noteText}
                onChange={(e) => updateFormData({ noteText: e.target.value })}
                placeholder="Any specific details about their impact..."
                className="resize-none"
                rows={3}
              />
            </div>
          )}


          {/* Navigation */}
          <div
            className="flex justify-between animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Link to="/culture-pulse">
              <Button variant="outline" className="btn-ghost">
                ← Back to Culture Pulse
              </Button>
            </Link>
            {isFormValid() ? (
              <Link to="/feedback">
                <Button className="btn-hero">
                  Continue → Yearly Feedback
                </Button>
              </Link>
            ) : (
              <Button className="btn-hero" disabled>
                Continue → Yearly Feedback
                <span className="ml-2 text-xs">(Select teammates and impact)</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Shoutouts;
