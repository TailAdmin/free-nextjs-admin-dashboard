import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

export const metadata = {
  title: "Clientes | Admin Dashboard",
  description: "Página de clientes do painel administrativo.",
};

const clientes = [
  { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999" },
  { id: 2, nome: "Maria Souza", email: "maria@email.com", telefone: "(21) 98888-8888" },
  { id: 3, nome: "Carlos Lima", email: "carlos@email.com", telefone: "(31) 97777-7777" },
];

export default function ClientesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Clientes" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Clientes">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{cliente.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cliente.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cliente.telefone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
} 