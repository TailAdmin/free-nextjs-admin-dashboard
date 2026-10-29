"use client";

import { BoxIcon, UsersIcon } from "@/icons";
import { useTranslations } from "next-intl";
import MetricCard from "./metric-card";

export default function EcommerceMetrics() {
  const t = useTranslations("ecommerce.metrics");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <MetricCard
        icon={<UsersIcon />}
        title={t("customers")}
        value="3,782"
        change="11.01%"
        direction="up"
      />
      <MetricCard
        icon={<BoxIcon />}
        title={t("orders")}
        value="5,359"
        change="9.05%"
        direction="down"
      />
    </div>
  );
}
