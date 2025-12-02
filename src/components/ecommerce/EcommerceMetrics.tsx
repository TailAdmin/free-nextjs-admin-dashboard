"use client";

import { getCustomersCount, getOrdersCount } from "@/actions/product";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,

} from "@/icons";
import { useQueries } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import NumberFlow from '@number-flow/react'

export const EcommerceMetrics = () => {
  const [customersCount, ordersCount] = useQueries({
    queries: [
      {
        queryKey: ["customers-count"],
        queryFn: () => getCustomersCount(),
        staleTime: 30 * 1000, // 30 seconds
      },
      {
        queryKey: ["orders-count"],
        queryFn: () => getOrdersCount(),
        staleTime: 30 * 1000, // 30 seconds
      }
    ],
  });
  console.log(customersCount.data);
  const isLoading =
    customersCount.isLoading || ordersCount.isLoading;
  const isError = customersCount.isError || ordersCount.isError;

  const cards = [
    {
      title: "Clientes",
      value: customersCount.data ?? 0,
      icon: GroupIcon,
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      badge: {
        color: "success",
        icon: ArrowUpIcon,
        value: "11.01%",
      },
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Pedidos",
      value: ordersCount.data ?? 0,
      icon: BoxIconLine,
      gradient: "from-blue-400 via-indigo-500 to-violet-600",
      badge: {
        color: "error",
        icon: ArrowDownIcon,
        value: "9.05%",
      },
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
              relative rounded-2xl p-6 shadow-lg hover:shadow-xl
              transition-all duration-300 overflow-hidden border

              bg-white border-gray-200  
              dark:bg-white/3 dark:border-gray-800
            "
          >
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {card.title}
                  </p>

                  <NumberFlow className={`text-4xl font-semibold mt-1 ${card.textColor}`} value={card.value ?? 0} />

               
                </div>

                <div
                  className={`
                    bg-linear-to-br ${card.gradient} flex items-center justify-center p-3 rounded-xl shadow-lg
                    dark:opacity-90
                  `}
                >
                  {isLoading ? <Loader2Icon className="w-7 h-7 text-white animate-spin" /> : <Icon className="size-7 pl-0.5 pt-0.5 text-white" />}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div
                  className={`
                    w-16 h-[3px] bg-linear-to-r ${card.gradient} rounded-full 
                    dark:opacity-90
                  `}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
