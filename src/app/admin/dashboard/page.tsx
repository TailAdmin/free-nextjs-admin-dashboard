import React from "react";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Bienvenido al panel de administración. Aquí podrás gestionar usuarios, productos y configuraciones globales.
          </p>
        </div>
      </div>
    </div>
  );
}
