import React, { useEffect, useState } from 'react';
import { formatPriceCLP } from '@/utils/formatting';
import { useCrudList } from '@/hooks/useCrudList';
import { filtrarPorEstado as _filtrarPorEstado } from '@/lib/promoUtils';
import type { Dish } from '@/types/dish';
import type { FilterType } from '@/types/common';
import { logError } from '@/utils/error';
import { Button, ErrorMessage, FilterTabs } from '@/components/ui';
import { Modal } from '@/components/ui/molecules';
import { EntityCardGrid, type EntityCardField } from '@/components/ui/organisms';
import DishForm from './DishForm';

interface DishManagerProps {
  filtro: {
    tipo: string;
    valor: string;
  };
}

/**
 * Componente para gestionar platos en el panel admin
 */
const DishManager: React.FC<DishManagerProps> = ({ filtro }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    items: dishes,
    loading,
    error,
    editingItem,
    filter,
    setFilter,
    handleNew,
    handleEdit,
    handleSave,
    handleToggleActive,
    setEditingItem,
  } = useCrudList<Dish>({
    table: 'dishes',
    defaultFilter: 'all',
    activeField: 'available',
  });

  // Utiliza el manejador de errores mejorado
  useEffect(() => {
    if (error) {
      logError(error, 'DishManager');
    }
  }, [error]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleNewDish = () => {
    handleNew();
    openModal();
  };

  const handleEditDish = (dish: Dish) => {
    console.log('Editando plato:', dish);
    handleEdit(dish);
    openModal();
  };

  const handleSaveDish = (data: Partial<Dish>) => {
    console.log('Guardando plato:', data);
    handleSave(data);
    closeModal();
  };

  const handleToggleDishActive = (dish: Dish) => {
    console.log('Cambiando estado del plato:', dish);
    handleToggleActive(dish);
  };

  // Aplica el filtro recibido
  const dishesFiltrados = dishes.filter((dish) => {
    if (filtro.tipo === 'todos') return true;
    if (filtro.tipo === 'estado') {
      return filtro.valor === 'activos' ? dish.available : !dish.available;
    }
    if (filtro.tipo === 'categoria') {
      return dish.category === filtro.valor;
    }
    return true;
  });

  // Definición de campos para la card
  const dishFields: EntityCardField<Dish>[] = [
    { key: 'name', label: 'Nombre', accessor: 'name', isPrimary: true },
    { key: 'description', label: 'Descripción', accessor: 'description', hideOnMobile: true },
    {
      key: 'price',
      label: 'Precio',
      accessor: 'price',
      formatter: (value) => formatPriceCLP(value as number),
    },
    { key: 'category', label: 'Categoría', accessor: 'category' },
    {
      key: 'available',
      label: 'Disponible',
      accessor: 'available',
      formatter: (value) =>
        value ? (
          <span className="text-green-600">Sí</span>
        ) : (
          <span className="text-gray-400">No</span>
        ),
    },
  ];

  // Opciones de filtro para FilterTabs
  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Solo activos', colorClass: 'bg-green-600' },
    { value: 'inactive', label: 'Solo inactivos', colorClass: 'bg-gray-400' },
  ];

  return (
    <main className="min-h-screen bg-background font-serif py-8 w-full">
      {error && <ErrorMessage error={error} className="mb-4 mx-auto max-w-2xl" />}

      <FilterTabs
        options={filterOptions}
        value={filter}
        onChange={(value) => setFilter(value as FilterType)}
      />

      <div className="mb-8 flex justify-end">
        <Button onClick={handleNewDish} leftIcon={<span>+</span>}>
          Nuevo Plato
        </Button>
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <EntityCardGrid
          items={dishesFiltrados}
          fields={dishFields}
          loading={loading}
          onEdit={handleEditDish}
          onToggleActive={handleToggleDishActive}
          emptyMessage="No hay platos registrados."
          darkTheme={true}
        />
      </div>

      <Modal
        title={editingItem?.id ? 'Editar Plato' : 'Nuevo Plato'}
        isOpen={isModalOpen}
        onClose={closeModal}
        maxWidth="max-w-xl"
      >
        <DishForm
          initialValues={editingItem || {}}
          onSave={handleSaveDish}
          onCancel={closeModal}
        />
      </Modal>
    </main>
  );
};

export default DishManager;
