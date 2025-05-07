import React from 'react';
import type { Dish } from '@/types/dish';
import type { Promo } from '@/types/promo';

// Tipo de unión para los elementos que pueden mostrarse en el grid
type GridItem = Dish | Promo;

// Props para el grid adaptadas para usar con los tipos
interface AdminGridProps {
  items: GridItem[];
  loading: boolean;
  error: string | null;
  onToggleActive: (item: GridItem) => void;
  onEdit?: (item: GridItem) => void;
  CardComponent: React.ComponentType<any>;
}

const AdminGrid: React.FC<AdminGridProps> = ({
  items,
  loading,
  error,
  onToggleActive,
  onEdit,
  CardComponent,
}) => {
  if (loading) return <div className="py-12 text-center text-muted">Cargando...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;
  if (!items.length) return <div className="py-12 text-center text-muted">No hay elementos.</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {items.map((item) => (
        <CardComponent key={item.id} item={item} onToggleActive={onToggleActive} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default AdminGrid;
