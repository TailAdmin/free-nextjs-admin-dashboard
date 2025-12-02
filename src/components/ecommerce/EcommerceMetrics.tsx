"use client";
import Badge from "../ui/badge/Badge";

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
      textColor: "text-emerald-600",
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
      textColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const BadgeIcon = card.badge.icon;

        return (
          <>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden">
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-slate-600 text-sm">{card.title}</p>
                    <p className={`text-4xl font-semibold mt-1 ${card.textColor}`}>
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`bg-linear-to-br ${card.gradient} p-3 rounded-xl shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div
                    className={`w-16 h-1 bg-linear-to-r ${card.gradient} rounded-full`}
                  />
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};
