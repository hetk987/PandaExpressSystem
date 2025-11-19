import Image from "next/image"
import React from "react";

import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "@/app/components/ui/item"

const CashierCard = (props: {
    name: string,
    key?: number
    className?: string
}) => {
  return (
    <Item
        key={props.name}
        variant="outline"
        className={`shadow-md bg-red-500 p-0 overflow-hidden rounded-lg ${props.className}`}
        >
        <ItemContent className="bg-red-500 text-white flex items-center justify-center p-3 aspect-square">
            <ItemTitle className="text-md font-semibold text-center min-h-10">{props.name}</ItemTitle>
        </ItemContent>
    </Item>
  );
};

export default CashierCard;