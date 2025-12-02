"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "@/icons";

export const EcommerceMetrics = () => {
  const cards = [
    {
      title: "Customers",
      value: "3,782",
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
      title: "Orders",
      value: "5,359",
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
              relative rounded-2xl p-6 shadow-xl hover:shadow-2xl
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

                  <p className={`text-4xl font-semibold mt-1 ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>

                <div
                  className={`
                    bg-linear-to-br ${card.gradient} p-3 rounded-xl shadow-lg
                    dark:opacity-90
                  `}
                >
                  <Icon className="w-7 h-7 text-white" />
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
