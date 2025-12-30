import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Teammate } from "@/data/teammates";

export type SpriteCarouselProps = {
  teammates: Teammate[];
  multiple?: boolean;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
};

const SpriteCarousel: React.FC<SpriteCarouselProps> = ({ teammates, multiple = false, selectedIds, onChange, className }) => {
  const toggle = (id: string) => {
    if (multiple) {
      onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
    } else {
      onChange(selectedIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2">
          {teammates.map((t) => (
            <CarouselItem key={t.id} className="basis-1/3 sm:basis-1/5 md:basis-1/6 pl-2">
              <button
                onClick={() => toggle(t.id)}
                className={cn(
                  "group w-full flex flex-col items-center gap-2 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-pressed={selectedIds.includes(t.id)}
              >
                <div
                  className={cn(
                    "w-full overflow-hidden rounded-full border border-border bg-card shadow-sm transition-all",
                    selectedIds.includes(t.id)
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md hover:scale-[1.01]",
                    selectedIds.length > 0 && !selectedIds.includes(t.id)
                      ? "opacity-50 grayscale"
                      : ""
                  )}
                >
                  <AspectRatio ratio={1}>
                    <img
                      src={t.sprite}
                      alt={`${t.name} full-body chibi avatar`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <span
                  className={cn(
                    "text-xs text-center",
                    selectedIds.includes(t.id)
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {t.name}
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default SpriteCarousel;
