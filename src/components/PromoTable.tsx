import React from "react";
import type { Promo } from "./AdminPromos";

interface PromoTableProps {
  promos: Promo[];
  loading: boolean;
  onEdit: (promo: Promo) => void;
  onToggleActive: (promo: Promo) => void;
}

const PromoTable: React.FC<PromoTableProps> = ({ promos, loading, onEdit, onToggleActive }) => (
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="min-w-full bg-white border border-border">
      <thead>
        <tr className="bg-gray-100 text-center">
          <th className="px-4 py-2">Título</th>
          <th className="px-4 py-2">Tipo</th>
          <th className="px-4 py-2">Inicio</th>
          <th className="px-4 py-2">Fin</th>
          <th className="px-4 py-2">Activo</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>
        ) : promos.length > 0 ? (
          promos.map((promo) => (
            <tr key={promo.id} className="border-t border-border">
              <td className="px-4 py-2 font-semibold">{promo.title}</td>
              <td className="px-4 py-2">{promo.type}</td>
              <td className="px-4 py-2">{promo.start_date}</td>
              <td className="px-4 py-2">{promo.end_date}</td>
              <td className="px-4 py-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${promo.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                  onClick={() => onToggleActive(promo)}
                >
                  {promo.active ? "Sí" : "No"}
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  className="px-2 py-1 text-sm bg-primary-light text-accent rounded hover:bg-primary"
                  onClick={() => onEdit(promo)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No hay promociones</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

export default PromoTable;
