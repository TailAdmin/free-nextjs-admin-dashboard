"use client";

import React, { useMemo, useState } from "react";



import {
  CheckCircleIcon,
  TimeIcon,
  DollarLineIcon,
  BoxCubeIcon,
} from "@/icons";

import { getProducts } from "@/actions/product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// ---------------------------------------------------
// Types
// ---------------------------------------------------
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

// MISMO ESTILO QUE TU EJEMPLO
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
    if (!products.length) return [];

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

  if (isPending) return <p className="text-gray-500">Cargando métricas...</p>;
  if (error) return <p className="text-red-500">Error al cargar productos.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((item, index) => {
        const conf = metricsConfig[item.key];
        const Icon = conf.icon;

        return (
          <
          >
            {/* CARD BLANCA */}
            <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200">
              
              <div className="relative z-10">
                {/* HEADER */}
                <div className="flex items-start justify-between mb-4">
                  
                  <div className="flex-1">
                    <p className="text-slate-600 text-sm mb-1">{item.label}</p>
                    <p className="text-slate-900 text-4xl">{item.value}</p>
                  </div>

                  {/* ICONO con fondo GRADIENTE (igual al ejemplo) */}
                  <div className={`bg-linear-to-br ${conf.gradient} p-3 rounded-xl shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* SUBTITLE + LINEA GRADIENT */}
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-xs">{conf.subtitle}</p>
                  <div className={`w-12 h-1 bg-linear-to-r ${conf.gradient} rounded-full`} />
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};
