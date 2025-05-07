import React from 'react';
import { EditIcon } from '@/components/ui/icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface GenericEntityCardProps<T extends { id: string | number }> {
  item: T;
  title: string;
  category?: string;
  price?: number | string; // Si es número, se formatea. Si es string, se muestra tal cual.
  isActive: boolean;

  onToggleActive: (item: T) => void;
  onEdit?: (item: T) => void;

  className?: string;
  additionalInfo?: React.ReactNode; // Para contenido extra como la descripción de una promo
}

const GenericEntityCard = <T extends { id: string | number }>({
  item,
  title,
  category,
  price,
  isActive,
  onToggleActive,
  onEdit,
  className,
  additionalInfo,
}: GenericEntityCardProps<T>) => {
  // Estilos base tomados de DishCard (tema "light")
  // Asegúrate que 'bg-gray-light', 'text-text', 'border-text-light', 'bg-green', 'bg-red'
  // estén definidos en tu tailwind.config.js
  const baseCardClasses = 'relative flex flex-col gap-2 p-4 rounded-lg shadow bg-gray-light';
  const textClasses = 'text-text';
  const subTextClasses = 'text-gray-400';
  const borderColorClass = 'border-text-light'; // Para el borde del precio

  const statusButtonBaseClasses =
    'inline-block w-20 py-2 rounded-full text-center text-xs font-bold hover:cursor-pointer';
  // Usamos text-text para el botón de estado para que coincida con DishCard
  const activeStatusClasses = 'bg-green text-text';
  const inactiveStatusClasses = 'bg-red text-text';

  return (
    <div className={twMerge(clsx(baseCardClasses, className))}>
      {onEdit && (
        <button
          className={clsx(
            'absolute top-2 right-2 hover:cursor-pointer focus:outline-none',
            textClasses,
            'hover:text-primary' // Asumiendo que 'text-primary' es tu color de acento para hover
          )}
          onClick={() => onEdit(item)}
          title="Editar"
        >
          <EditIcon className="w-5 h-5" />
        </button>
      )}

      <div className="pr-8">
        {' '}
        {/* Añadido padding a la derecha para que el título no se solape con el botón de editar */}
        <h2 className={clsx('text-lg font-bold', textClasses)}>{title}</h2>
        {category && <p className={clsx('text-sm', subTextClasses)}>Categoría: {category}</p>}
      </div>

      {additionalInfo}

      <div className={clsx('flex items-center justify-between')}>
        <p className={clsx('text-sm', textClasses)}>Estado:</p>
        <button
          onClick={() => onToggleActive(item)}
          className={clsx(
            statusButtonBaseClasses,
            isActive ? activeStatusClasses : inactiveStatusClasses
          )}
          title={isActive ? 'Haz clic para desactivar' : 'Haz clic para activar'}
        >
          {isActive ? 'Activo' : 'Inactivo'}
        </button>
      </div>

      {price !== undefined && (
        <div
          className={clsx(
            'flex items-center justify-between rounded border-b-3 pb-2',
            borderColorClass,
            textClasses
          )}
        >
          <div className={clsx('text-sm', textClasses)}>{price !== undefined && 'Precio'}</div>
          <div className="text-lg font-semibold">
            {typeof price === 'number' ? `$${price.toLocaleString('es-CL')}` : price}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericEntityCard;
