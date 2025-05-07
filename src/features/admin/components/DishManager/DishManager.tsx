import React, { useEffect, useState, useMemo } from 'react';
import { formatPriceCLP } from '@/utils/formatting';
import { useCrudList } from '@/hooks/useCrudList';
import type { Dish, DishCategory } from '@/types/dish';
import type { FilterType } from '@/types/common';
import { logError } from '@/utils/error';
import { Button, ErrorMessage, FilterTabs, Input } from '@/components/ui';
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
  const [searchTerm, setSearchTerm] = useState('');

  const {
    items: dishes,
    loading,
    error,
    editingItem,
    filter: statusFilter,
    setFilter: setStatusFilter,
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

  useEffect(() => {
    if (error) {
      logError(error, 'DishManager');
    }
  }, [error]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };
  const handleNewDish = () => {
    handleNew();
    openModal();
  };
  const handleEditDish = (dish: Dish) => {
    handleEdit(dish);
    openModal();
  };
  const handleSaveDish = (data: Partial<Dish>) => {
    handleSave(data);
    closeModal();
  };
  const handleToggleDishActive = (dish: Dish) => handleToggleActive(dish);

  const processedDishes = useMemo(() => {
    let filteredItems = [...dishes];

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.trim().toLowerCase();
      filteredItems = filteredItems.filter(
        (dish) =>
          dish.name.toLowerCase().includes(lowerSearchTerm) ||
          (dish.description && dish.description.toLowerCase().includes(lowerSearchTerm))
      );
    } else {
      if (filtro.tipo === 'categoria') {
        filteredItems = filteredItems.filter((dish) => dish.category === filtro.valor);
      }
    }

    if (statusFilter === 'active') {
      filteredItems = filteredItems.filter((dish) => dish.available);
    } else if (statusFilter === 'inactive') {
      filteredItems = filteredItems.filter((dish) => !dish.available);
    }

    return filteredItems;
  }, [dishes, searchTerm, filtro, statusFilter]);

  const displayTitle = useMemo(() => {
    if (searchTerm.trim() !== '') {
      return `Resultados de búsqueda para: "${searchTerm.trim()}"`;
    }
    if (filtro.tipo === 'categoria' && filtro.valor) {
      const categoryName = filtro.valor.charAt(0).toUpperCase() + filtro.valor.slice(1);
      return `Categoría: ${categoryName}`;
    }
    if (filtro.tipo === 'estado' && filtro.valor) {
      const statusName = filtro.valor.charAt(0).toUpperCase() + filtro.valor.slice(1);
      return `Platos: ${statusName}`;
    }
    return 'Todos los Platos';
  }, [searchTerm, filtro]);

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

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Solo activos', colorClass: 'bg-green-600' },
    { value: 'inactive', label: 'Solo inactivos', colorClass: 'bg-gray-400' },
  ];

  return (
    <main className="min-h-screen bg-background font-serif py-8 w-full">
      {error && <ErrorMessage error={error} className="mb-4 mx-auto max-w-2xl" />}

      <div className="w-full max-w-screen-2xl mx-auto px-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-text">{displayTitle}</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Input
              type="text"
              placeholder="Buscar platos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button onClick={handleNewDish} leftIcon={<span>+</span>} className="w-full sm:w-auto">
              Nuevo Plato
            </Button>
          </div>
        </div>
        <FilterTabs
          options={filterOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as FilterType)}
        />
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <EntityCardGrid
          items={processedDishes}
          fields={dishFields}
          loading={loading}
          onEdit={handleEditDish}
          onToggleActive={handleToggleDishActive}
          emptyMessage={
            searchTerm.trim() !== ''
              ? 'No se encontraron platos para tu búsqueda.'
              : 'No hay platos que coincidan con los filtros.'
          }
          darkTheme={true}
        />
      </div>

      <Modal
        title={editingItem?.id ? 'Editar Plato' : 'Nuevo Plato'}
        isOpen={isModalOpen}
        onClose={closeModal}
        maxWidth="max-w-xl"
      >
        <DishForm initialValues={editingItem || {}} onSave={handleSaveDish} onCancel={closeModal} />
      </Modal>
    </main>
  );
};

export default DishManager;
