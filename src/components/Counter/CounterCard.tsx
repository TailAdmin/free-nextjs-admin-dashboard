import React from "react";
import {Card, Tooltip} from "@nextui-org/react";
interface CounterCardProps {
    title: string;
    value: string;
    hint: string;
  }
export const CounterCard: React.FC<CounterCardProps> = ({title, value, hint}) =>{
  return (
    <Tooltip content={hint}>
      <Card className="flex flex-col items-center p-4 shadow-md bg-white rounded-lg min-w-[160px] max-w-[160px] max-h-[85px]">
        {/* Заголовок */}
        <label className="font-semibold text-sm text-gray-500">
          {title}
        </label>

        {/* Значение */}
        <label className="font-bold text-gray-900 text-3xl mt-1">
          {value}
        </label>
      </Card>
    </Tooltip>  
  );
}