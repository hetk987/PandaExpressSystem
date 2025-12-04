import Image from "next/image"
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "@/app/components/ui/item"
import { useAccessibilityStyles } from "@/hooks/use-accessibility-styles";
import { cn } from "@/lib/utils";

const MealCard = (props: {
    name: string,
    image?: string | null,
    key?: number
    className?: string
    variant?: "default" | "selected" | "compact"
}) => {
  const { textClasses } = useAccessibilityStyles();
  const variant = props.variant || "default";

  return (
    <Item
        key={props.name}
        variant="outline"
        className={cn(
          "group relative overflow-hidden rounded-xl border-0 p-0 transition-all duration-300",
          // Glass background with maroon gradient
          "bg-gradient-to-br from-tamu-maroon/90 to-tamu-maroon-dark/95",
          "backdrop-blur-sm shadow-lg",
          // Hover effects
          "hover:shadow-2xl hover:scale-[1.03] hover:from-tamu-maroon hover:to-tamu-maroon-dark",
          // Glass border effect
          "before:absolute before:inset-0 before:rounded-xl before:border before:border-white/20 before:pointer-events-none",
          // Subtle inner glow on hover
          "after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300",
          "after:bg-gradient-to-t after:from-white/0 after:to-white/10 after:pointer-events-none",
          "hover:after:opacity-100",
          textClasses,
          props.className
        )}
    >
        {/* Image container with overlay */}
        <ItemHeader className="relative p-0 bg-white/95 overflow-hidden">
            {props.image ? (
              <div className="relative">
                <Image
                  src={props.image}
                  alt={props.name}
                  width={200}
                  height={200}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gradient-to-br from-white/90 to-white/70 flex justify-center items-center">
                <div className="flex flex-col items-center gap-2 text-tamu-maroon/60 group-hover:text-tamu-maroon transition-colors duration-300">
                  <div className="size-12 rounded-full bg-tamu-maroon/10 flex items-center justify-center group-hover:bg-tamu-maroon/20 transition-colors duration-300">
                    <span className="font-bold text-3xl">+</span>
                  </div>
                  <span className="text-xs font-medium">Select</span>
                </div>
              </div>
            )}
        </ItemHeader>

        {/* Content footer with glass effect */}
        <ItemContent className="relative bg-transparent text-white flex items-center justify-center p-3 min-h-[60px]">
          {/* Glass overlay for text area */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <ItemTitle className={cn(
            "relative z-10 text-sm font-semibold text-center leading-tight",
            "drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
            textClasses
          )}>
            {props.name}
          </ItemTitle>
        </ItemContent>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-white/10 rotate-45 transform origin-center" />
        </div>
    </Item>
  );
};

export default MealCard;
