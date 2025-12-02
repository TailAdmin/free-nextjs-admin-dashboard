"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircleIcon,
  TimeIcon,
  DollarLineIcon,
  BoxCubeIcon,
} from "@/icons";
import NumberFlow from '@number-flow/react'

import { getProducts } from "@/actions/product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

interface Product {
  id: number;
  estado: boolean;
  inventario: number | null;
  vendidos: number;
}

interface MetricItem {
  id: number;
  key: keyof typeof metricsConfig;
  label: string;
  value: number;
}

type MetricConfig = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
  subtitle: string;
};

const metricsConfig = {
  activos: {
    icon: CheckCircleIcon,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    subtitle: "Productos disponibles",
  },
  pausados: {
    icon: TimeIcon,
    gradient: "from-amber-400 via-orange-500 to-red-500",
    subtitle: "En pausa",
  },
  vendidos: {
    icon: DollarLineIcon,
    gradient: "from-blue-400 via-indigo-500 to-violet-600",
    subtitle: "Total vendidos",
  },
  sinStock: {
    icon: BoxCubeIcon,
    gradient: "from-slate-400 via-gray-500 to-zinc-600",
    subtitle: "Requieren reabasto",
  },
} satisfies Record<string, MetricConfig>;

export const ProductsMetrics = () => {
  const [page] = useState(1);

  const { data, isPending, error } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts({ page }),
    placeholderData: keepPreviousData,
  });

  const products: Product[] = data?.products ?? [];

  const metrics: MetricItem[] = useMemo(() => {
    if (!products.length) return [
      { id: 1, key: "activos", label: "Activos", value: 0 },
      { id: 2, key: "pausados", label: "Pausados", value: 0 },
      { id: 3, key: "vendidos", label: "Vendidos", value: 0 },
      { id: 4, key: "sinStock", label: "Sin stock", value: 0 },
    ];

    const activos = products.filter((p) => p.estado).length;
    const pausados = products.filter((p) => !p.estado).length;
    const vendidos = products.reduce((acc, p) => acc + (p.vendidos ?? 0), 0);
    const sinStock = products.filter((p) => (p.inventario ?? 0) <= 0).length;

    return [
      { id: 1, key: "activos", label: "Activos", value: activos },
      { id: 2, key: "pausados", label: "Pausados", value: pausados },
      { id: 3, key: "vendidos", label: "Vendidos", value: vendidos },
      { id: 4, key: "sinStock", label: "Sin stock", value: sinStock },
    ];
  }, [products]);
  console.log("metrics", metrics);

  // if (isPending) return <p className="text-gray-500 dark:text-gray-400">Cargando métricas...</p>;
  if (error) return <p className="text-red-500">Error al cargar productos.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((item) => {
        const conf = metricsConfig[item.key];
        const Icon = conf.icon;

        return (
          <div
            key={item.id}
            className="
              relative rounded-2xl p-6 shadow-lg hover:shadow-xl
              transition-all duration-300 overflow-hidden border 
              bg-white border-slate-200
              dark:bg-white/3 dark:border-gray-800
            "
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-slate-600 dark:text-gray-400 text-sm mb-1">
                    {item.label}
                  </p>
                  <NumberFlow className="text-slate-900 dark:text-white/90 text-4xl font-semibold" value={item.value} />

                  {/* <p className="text-slate-900 dark:text-white/90 text-4xl font-semibold">
                    {item.value}
                  </p> */}
                </div>
                <div
                  className={`
                    bg-linear-to-br ${conf.gradient}
                    rounded-2xl shadow-lg
                    flex items-center justify-center w-14 h-14
                  `}
                >
                  {isPending ? <Loader2Icon className="w-7 h-7 text-white animate-spin" /> : <Icon className="w-7 h-7 pl-0.5 pt-0.5 text-white" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-gray-500 text-xs">
                  {conf.subtitle}
                </p>

                <div
                  className={`w-12 h-1 bg-linear-to-r ${conf.gradient} rounded-full`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
