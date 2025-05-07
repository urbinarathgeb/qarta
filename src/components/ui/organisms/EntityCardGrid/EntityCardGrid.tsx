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

  /**
   * Indica si el campo debe mostrarse con prioridad
   */
  isPrimary?: boolean;

  /**
   * Indica si el campo debe ocultarse en móvil
   */
  hideOnMobile?: boolean;
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

  /**
   * Si debe usar el tema oscuro (estilo original)
   */
  darkTheme?: boolean;
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
  darkTheme = false,
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
        'grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {items.map((item: T, idx) => {
        // Detecta si el item tiene campo 'available' o 'active'
        const isAvailable = (item as any).available ?? (item as any).active;
        const itemId = (item as any).id ?? idx;
        const activeField = Object.prototype.hasOwnProperty.call(item, 'available')
          ? 'available'
          : 'active';

        // Obtener campos primarios para mostrar prominentemente
        const primaryFields = fields.filter((field) => field.isPrimary);
        const regularFields = fields.filter(
          (field) =>
            !field.isPrimary && field.accessor !== 'available' && field.accessor !== 'active'
        );
        const statusField = fields.find(
          (field) => field.accessor === 'available' || field.accessor === 'active'
        );

        return (
          <div
            key={itemId}
            className={clsx(
              'rounded-lg shadow flex flex-col h-full min-w-0 break-words relative overflow-hidden p-4 gap-2',
              darkTheme ? 'bg-gray-800 text-white' : 'bg-white border'
            )}
          >
            {/* Botón de menú en la esquina superior derecha */}
            {onEdit && (
              <button
                onClick={() => {
                  console.log('Botón de edición clickeado para:', item);
                  onEdit(item);
                }}
                className={clsx(
                  'absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                  darkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:bg-gray-100'
                )}
                title="Editar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            )}

            {/* Campos primarios (como título) */}
            {primaryFields.map((field) => (
              <div key={field.key} className={clsx('mb-1', field.className)}>
                <h3
                  className={clsx('font-bold text-lg', darkTheme ? 'text-white' : 'text-gray-900')}
                >
                  {field.formatter
                    ? field.formatter((item as any)[field.accessor])
                    : String((item as any)[field.accessor] ?? '-')}
                </h3>
                <p className={clsx('text-sm', darkTheme ? 'text-gray-400' : 'text-gray-500')}>
                  Categoría: {(item as any).category}
                </p>
              </div>
            ))}

            {/* Estado */}
            {onToggleActive && (
              <div className="flex items-center justify-between">
                <p className={clsx('text-sm', darkTheme ? 'text-white' : 'text-gray-700')}>
                  Estado:
                </p>
                <button
                  onClick={() => {
                    console.log('Botón de toggle clickeado para:', item);
                    console.log('Estado actual:', isAvailable);
                    onToggleActive(item);
                  }}
                  className={clsx(
                    'inline-block w-20 py-2 rounded-full text-center text-xs font-bold',
                    isAvailable
                      ? darkTheme
                        ? 'bg-green-600'
                        : 'bg-green-100 text-green-800'
                      : darkTheme
                        ? 'bg-red-600'
                        : 'bg-gray-100 text-gray-600'
                  )}
                  title={isAvailable ? 'Haz clic para desactivar' : 'Haz clic para activar'}
                >
                  {isAvailable ? 'Activo' : 'Inactivo'}
                </button>
              </div>
            )}

            {/* Campos regulares */}
            {regularFields.map((field) => (
              <div
                key={field.key}
                className={clsx(
                  'flex items-center justify-between',
                  field.accessor === 'price' && 'border-b border-gray-600 pb-2',
                  field.className,
                  field.hideOnMobile && 'hidden sm:flex'
                )}
              >
                <span className={clsx('text-sm', darkTheme ? 'text-gray-400' : 'text-gray-500')}>
                  {field.label}
                </span>
                <span className={clsx('font-semibold', darkTheme ? 'text-white' : 'text-gray-800')}>
                  {field.formatter
                    ? field.formatter((item as any)[field.accessor])
                    : String((item as any)[field.accessor] ?? '-')}
                </span>
              </div>
            ))}

            {/* Acciones personalizadas */}
            {actions && <div className="mt-auto pt-4 flex gap-2">{actions(item)}</div>}

            {/* Botón de edición */}
            {onEdit && !actions && (
              <div className="mt-auto pt-4 flex justify-end">
                <Button
                  variant={darkTheme ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => {
                    console.log('Botón Editar clickeado para:', item);
                    onEdit(item);
                  }}
                >
                  Editar
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default EntityCardGrid;
