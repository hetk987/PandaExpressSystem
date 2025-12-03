import Image from "next/image"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/app/components/ui/item"
import { useAccessibilityStyles } from "@/hooks/use-accessibility-styles";

const MealCard = (props: {
    name: string,
    image?: string | null,
    key?: number
    className?: string
}) => {
  const { textClasses } = useAccessibilityStyles();

  return (
    <Item
        key={props.name}
        variant="outline"
        className={`shadow-md bg-red-500 p-0 overflow-hidden rounded-lg ${textClasses} ${props.className}`}
        >
        <ItemHeader className="p-0 bg-white">
            {props.image ?
              <Image
                src={props.image}
                alt={props.name}
                width={128}
                height={128}
                className="aspect-square w-full object-cover"
              />
            : <div className="aspect-square w-full object-cover flex justify-center items-center"><p className="font-extrabold text-3xl">+</p></div>
          }
        </ItemHeader>

        <ItemContent className="bg-red-500 text-white flex items-center justify-center p-3 pt-0">
            <ItemTitle className={`text-md font-semibold text-center min-h-10 ${textClasses}`}>{props.name}</ItemTitle>
        </ItemContent>
    </Item>
  );
};

export default MealCard;