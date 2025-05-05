import React from 'react';

interface Props {
  items: any[];
  loading: boolean;
  error: string | null;
  onToggleActive: (item: any) => void;
  CardComponent: React.FC<{ item: any; onToggleActive: (item: any) => void }>;
}

const AdminGrid: React.FC<Props> = ({ items, loading, error, onToggleActive, CardComponent }) => {
  if (loading) return <div className="text-center text-muted py-12">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!items.length) return <div className="text-center text-muted py-12">No hay elementos.</div>;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {items.map((item) => (
        <CardComponent key={item.id} item={item} onToggleActive={onToggleActive} />
      ))}
    </div>
  );
};

export default AdminGrid;
