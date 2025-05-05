import React from 'react';
import { Button } from '@/components/ui';
import { clsx } from 'clsx';

export type EntityCardField<T> = {
  /**
   * Clave única para el campo
   */
  key: string;

  /**
   * Etiqueta a mostrar para el campo
   */
  label: string;

  /**
   * Clave del objeto T para acceder al valor
   */
  accessor: keyof T | string;

  /**
   * Función para formatear el valor antes de mostrarlo
   */
  formatter?: (value: any) => React.ReactNode;

  /**
   * Clases CSS adicionales para el campo
   */
  className?: string;
};

export interface EntityCardGridProps<T> {
  /**
   * Colección de elementos a mostrar
   */
  items: T[];

  /**
   * Configuración de campos a mostrar para cada elemento
   */
  fields: EntityCardField<T>[];

  /**
   * Indica si está en estado de carga
   */
  loading?: boolean;

  /**
   * Callback para editar un elemento
   */
  onEdit?: (item: T) => void;

  /**
   * Callback para activar/desactivar un elemento
   */
  onToggleActive?: (item: T) => void;

  /**
   * Mensaje a mostrar cuando no hay elementos
   */
  emptyMessage?: string;

  /**
   * Función para renderizar acciones personalizadas
   */
  actions?: (item: T) => React.ReactNode;

  /**
   * Clases CSS adicionales para la grid
   */
  className?: string;
}

/**
 * Componente para mostrar una grilla de tarjetas con información de entidades,
 * con soporte para edición, activación/desactivación y acciones personalizadas.
 */
function EntityCardGrid<T>({
  items,
  fields,
  loading = false,
  onEdit,
  onToggleActive,
  emptyMessage = 'No hay elementos',
  actions,
  className,
}: EntityCardGridProps<T>) {
  if (loading) {
    return <div className="text-center text-gray-500 py-12">Cargando...</div>;
  }

  if (!items || items.length === 0) {
    return <div className="text-center text-gray-500 py-12">{emptyMessage}</div>;
  }

  return (
    <div
      className={clsx(
        'grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5',
        className
      )}
    >
      {items.map((item: T, idx) => {
        // Detecta si el item tiene campo 'available' o 'active'
        const isAvailable = (item as any).available ?? (item as any).active;
        const itemId = (item as any).id ?? idx;

        return (
          <div
            key={itemId}
            className="border rounded-lg bg-white shadow p-5 flex flex-col h-full min-w-0 break-words"
          >
            {fields.map((field) => (
              <div key={field.key} className={clsx('mb-1', field.className)}>
                <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">
                  {field.label}
                </span>
                <span
                  className={clsx(
                    'block text-base',
                    field.accessor === 'available' || field.accessor === 'active'
                      ? isAvailable
                        ? 'font-bold text-green-600'
                        : 'font-bold text-gray-400'
                      : 'font-medium'
                  )}
                >
                  {field.formatter
                    ? field.formatter((item as any)[field.accessor])
                    : String((item as any)[field.accessor] ?? '-')}
                </span>
              </div>
            ))}

            {actions ? (
              <div className="mt-4 flex gap-2">{actions(item)}</div>
            ) : (
              <div className="mt-4 flex gap-2">
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                    Editar
                  </Button>
                )}
                {onToggleActive && (
                  <Button
                    variant={isAvailable ? 'danger' : 'success'}
                    size="sm"
                    onClick={() => onToggleActive(item)}
                  >
                    {isAvailable ? 'Desactivar' : 'Activar'}
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default EntityCardGrid;
