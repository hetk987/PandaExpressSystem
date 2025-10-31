import Image from "next/image"
import React from "react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

const MealCard = (props: {
    name: string,
    image: string,
    key: number
}) => {
  return (
    <Item
        key={props.name}
        variant="outline"
        className="shadow-sm bg-red-500 p-0 overflow-hidden rounded-lg"
        >
        <ItemHeader className="p-0 bg-white">
            <Image
            src={props.image}
            alt={props.name}
            width={128}
            height={128}
            className="aspect-square w-full object-cover"
            />
        </ItemHeader>

        <ItemContent className="bg-red-500 text-white flex items-center justify-center p-3 pt-0">
            <ItemTitle className="text-md font-semibold text-center">{props.name}</ItemTitle>
        </ItemContent>
    </Item>
  );
};

export default MealCard;