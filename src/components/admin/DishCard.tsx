import React from 'react';

interface DishCardProps {
  item: any; // O el tipo específico de tu dish si lo tienes
  onToggleActive: (dish: any) => void;
  onEdit?: (dish: any) => void; // Añadimos la función onEdit opcional
}

const DishCard: React.FC<DishCardProps> = ({ item: dish, onToggleActive, onEdit }) => (
  <div className="relative flex flex-col gap-2 p-4 rounded-lg shadow bg-gray-light">
    <div>
      <h2 className="text-lg font-bold text-text">{dish.name}</h2>
      <p className="text-sm text-gray-400">Categoría: {dish.category}</p>
    </div>

    <div className="flex items-center justify-between">
      <p className="text-sm text-text">Estado:</p>
      <button
        onClick={() => onToggleActive(dish)}
        className={`inline-block w-20 py-2 rounded-full text-text text-center text-xs font-bold hover:cursor-pointer ${dish.available ? 'bg-green' : 'bg-red'
          }`}
        title={dish.available ? "Haz clic para desactivar" : "Haz clic para activar"}
      >
        {dish.available ? 'Activo' : 'Inactivo'}
      </button>
    </div>
    <div className="flex items-center justify-between rounded border-b-3 border-text-light text-text">
      <div className="text-sm text-text">Precio</div>
      <div className="text-lg font-semibold">${dish.price?.toLocaleString('es-CL')}</div>
    </div>

    <button
      className="absolute top-2 right-2 text-text hover:text-white hover:cursor-pointer"
      onClick={() => onEdit && onEdit(dish)}
      title="Editar"
    >
      ⋯
    </button>
  </div>
);

export default DishCard;
