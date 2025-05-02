import React from "react";

export type CrudCardField<T> = {
  label: string;
  accessor: keyof T | string;
  render?: (item: T) => React.ReactNode;
  className?: string;
};

interface CrudCardListProps<T> {
  items: T[];
  fields: CrudCardField<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onToggleActive?: (item: T) => void;
  emptyMessage?: string;
  actions?: (item: T) => React.ReactNode;
}

function CrudCardList<T>({
  items,
  fields,
  loading = false,
  onEdit,
  onToggleActive,
  emptyMessage = "No hay elementos",
  actions,
}: CrudCardListProps<T>) {
  if (loading) {
    return <div className="text-center text-muted py-12">Cargando...</div>;
  }
  if (!items.length) {
    return <div className="text-center text-muted py-12">{emptyMessage}</div>;
  }
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {items.map((item: T, idx) => {
        // Detecta si el item tiene campo 'available' o 'active'
        const isAvailable = (item as any).available ?? (item as any).active;
        return (
          <div key={(item as any).id ?? idx} className="border rounded-lg bg-white shadow p-5 flex flex-col h-full min-w-0 break-words">
            {fields.map((field, i) => (
              <div key={i} className={`mb-1 ${field.className ?? ''}`.trim()}>
                <span className="block text-xs text-muted font-semibold uppercase tracking-wide mb-0.5">{field.label}</span>
                <span className={
                  field.accessor === "available" || field.accessor === "active"
                    ? isAvailable
                      ? "block text-base font-bold text-green-600"
                      : "block text-base font-bold text-gray-400"
                    : "block text-base font-medium"
                }>
                  {field.render ? field.render(item) : String((item as any)[field.accessor])}
                </span>
              </div>
            ))}
            {actions ? (
              <div className="mt-4 flex gap-2">{actions(item)}</div>
            ) : (
              <div className="mt-4 flex gap-2">
                {onEdit && (
                  <button
                    className="px-3 py-1 rounded bg-primary-light text-accent font-semibold hover:bg-primary transition"
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </button>
                )}
                {onToggleActive && (
                  <button
                    className={`px-3 py-1 rounded font-semibold transition ${isAvailable ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                    onClick={() => onToggleActive(item)}
                  >
                    {isAvailable ? "Desactivar" : "Activar"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CrudCardList;
