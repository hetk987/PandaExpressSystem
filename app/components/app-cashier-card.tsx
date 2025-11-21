import React from "react";

const CashierCard = (props: {
    name: string,
    key?: number
    className?: string
}) => {
  return (
    <div
        className={`
            aspect-square 
            bg-panda-red 
            hover:bg-panda-dark-red 
            active:scale-95
            transition-all 
            duration-150 
            rounded-lg 
            shadow-md 
            hover:shadow-lg
            flex 
            items-center 
            justify-center 
            p-6
            cursor-pointer
            border-2
            border-transparent
            hover:border-panda-light-red
            ${props.className || ''}
        `}
    >
        <h3 className="text-white text-xl font-bold text-center leading-tight">
            {props.name}
        </h3>
    </div>
  );
};

export default CashierCard;