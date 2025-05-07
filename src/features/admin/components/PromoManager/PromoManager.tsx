import React, { useEffect, useState, useMemo } from 'react';
import { formatPriceCLP, formatDate } from '@/utils/formatting';
import { useCrudList } from '@/hooks/useCrudList';
import { filtrarPorEstado as _filtrarPorEstado } from '@/lib/promoUtils';
import type { Promo } from '@/types/promo';
import type { FilterType } from '@/types/common';
import { logError } from '@/utils/error';
import { Button, ErrorMessage, FilterTabs } from '@/components/ui';
import { Modal } from '@/components/ui/molecules';
import { EntityCardGrid, type EntityCardField } from '@/components/ui/organisms';
import PromoForm from './PromoForm';

interface PromoManagerProps {
  filtro: {
    tipo: string;
    valor: string;
  };
}

/**
 * Componente para gestionar promociones en el panel admin
 */
const PromoManager: React.FC<PromoManagerProps> = ({ filtro }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    items: promos,
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
  } = useCrudList<Promo>({
    table: 'promos',
    defaultFilter: 'all',
    activeField: 'active',
  });

  // Utiliza el manejador de errores mejorado
  useEffect(() => {
    if (error) {
      logError(error, 'PromoManager');
    }
  }, [error]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleNewPromo = () => {
    handleNew();
    openModal();
  };

  const handleEditPromo = (promo: Promo) => {
    console.log('Editando promoción:', promo);
    handleEdit(promo);
    openModal();
  };

  const handleSavePromo = (data: Partial<Promo>) => {
    console.log('Guardando promoción:', data);
    handleSave(data);
    closeModal();
  };

  const handleTogglePromoActive = (promo: Promo) => {
    console.log('Cambiando estado de promoción:', promo);
    handleToggleActive(promo);
  };

  // Filtrado de promociones con búsqueda incluida
  const promosFiltrados = useMemo(() => {
    return promos.filter((promo) => {
      if (filtro.tipo === 'todos') return true;
      if (filtro.tipo === 'estado') {
        return filtro.valor === 'activos' ? promo.active : !promo.active;
      }
      if (filtro.tipo === 'tipo' || filtro.tipo === 'categoria') {
        return promo.type === filtro.valor;
      }
      return true;
    });
  }, [promos, filtro]);

  // Definición de campos para la card
  const promoFields: EntityCardField<Promo>[] = [
    { key: 'title', label: 'Título', accessor: 'title', isPrimary: true },
    { key: 'description', label: 'Descripción', accessor: 'description', hideOnMobile: true },
    { key: 'type', label: 'Tipo', accessor: 'type' },
    {
      key: 'start_date',
      label: 'Inicio',
      accessor: 'start_date',
      formatter: (value) => formatDate(value as string),
    },
    {
      key: 'end_date',
      label: 'Fin',
      accessor: 'end_date',
      formatter: (value) => formatDate(value as string),
      hideOnMobile: true,
    },
    {
      key: 'price',
      label: 'Precio',
      accessor: 'price',
      formatter: (value) => (value ? formatPriceCLP(value as number) : '-'),
    },
    {
      key: 'active',
      label: 'Activa',
      accessor: 'active',
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
    { value: 'all', label: 'Todas' },
    { value: 'active', label: 'Solo activas', colorClass: 'bg-green-600' },
    { value: 'inactive', label: 'Solo inactivas', colorClass: 'bg-gray-400' },
  ];

  // Título a mostrar según los filtros aplicados
  const displayTitle = useMemo(() => {
    if (filtro.tipo === 'tipo' && filtro.valor) {
      const typeName = String(filtro.valor).charAt(0).toUpperCase() + String(filtro.valor).slice(1);
      return `Tipo: ${typeName}`;
    }
    if (filtro.tipo === 'estado' && filtro.valor) {
      const statusName =
        String(filtro.valor).charAt(0).toUpperCase() + String(filtro.valor).slice(1);
      return `Promociones: ${statusName}`;
    }
    return 'Todas las Promociones';
  }, [filtro]);

  return (
    <main className="min-h-screen bg-background font-serif py-8 w-full">
      {error && <ErrorMessage error={error} className="mb-4 mx-auto max-w-2xl" />}

      <div className="w-full max-w-screen-2xl mx-auto px-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-text">{displayTitle}</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button onClick={handleNewPromo} leftIcon={<span>+</span>} className="w-full sm:w-auto">
              Nueva Promoción
            </Button>
          </div>
        </div>
        <FilterTabs
          options={filterOptions}
          value={filter}
          onChange={(value) => setFilter(value as FilterType)}
        />
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <EntityCardGrid
          items={promosFiltrados}
          fields={promoFields}
          loading={loading}
          onEdit={handleEditPromo}
          onToggleActive={handleTogglePromoActive}
          emptyMessage={'No hay promociones que coincidan con los filtros.'}
        />
      </div>

      <Modal
        title={editingItem?.id ? 'Editar Promoción' : 'Nueva Promoción'}
        isOpen={isModalOpen}
        onClose={closeModal}
        maxWidth="max-w-xl"
      >
        <PromoForm
          initialValues={editingItem || {}}
          onSave={handleSavePromo}
          onCancel={closeModal}
        />
      </Modal>
    </main>
  );
};

export default PromoManager;
