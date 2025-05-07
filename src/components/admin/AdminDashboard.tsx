// src/components/admin/AdminDashboard.tsx
import React, { useState, useMemo } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminGrid from '@/components/admin/AdminGrid';
import DishCard from '@/components/admin/DishCard';
import PromoCard from '@/components/admin/PromoCard';
import { Modal } from '@/components/ui/molecules';
import DishForm from '@/features/admin/components/DishManager/DishForm';
import PromoForm from '@/features/admin/components/PromoManager/PromoForm';
import type { Filtro } from '@/lib/promoUtils';
import { useCrudList } from '@/hooks/useCrudList';

type Seccion = 'dishes' | 'promos';

// Estructura simplificada para la configuración de secciones
interface SectionConfig {
  table: string;
  activeField: string;
  addLabel: string;
  modalTitleEdit: string;
  modalTitleNew: string;
  searchPlaceholder: string;
}

const sectionConfigs: Record<Seccion, SectionConfig> = {
  dishes: {
    table: 'dishes',
    activeField: 'available',
    addLabel: 'Añadir plato',
    modalTitleEdit: 'Editar Plato',
    modalTitleNew: 'Nuevo Plato',
    searchPlaceholder: 'Buscar platos...',
  },
  promos: {
    table: 'promos',
    activeField: 'active',
    addLabel: 'Añadir promo',
    modalTitleEdit: 'Editar Promoción',
    modalTitleNew: 'Nueva Promoción',
    searchPlaceholder: 'Buscar promociones...',
  },
};

const AdminDashboard: React.FC = () => {
  const [seccion, setSeccion] = useState<Seccion>('dishes');
  const [filtro, setFiltro] = useState<Filtro>({ tipo: 'todos' });
  const [search, setSearch] = useState('');

  // Obtener la configuración correspondiente a la sección actual
  const config = sectionConfigs[seccion];

  // Hook para platos
  const {
    items: dishesData,
    loading: loadingDishes,
    error: errorDishes,
    handleToggleActive: handleToggleActiveDish,
    handleNew: handleNewDish,
    handleEdit: handleEditDish,
    handleSave: handleSaveDish,
    editingItem: editingDish,
    showForm: showDishForm,
    setShowForm: setShowDishForm,
    setEditingItem: setEditingDish,
  } = useCrudList<any>({ table: 'dishes', activeField: 'available' });

  // Hook para promociones
  const {
    items: promosData,
    loading: loadingPromos,
    error: errorPromos,
    handleToggleActive: handleToggleActivePromo,
    handleNew: handleNewPromo,
    handleEdit: handleEditPromo,
    handleSave: handleSavePromo,
    editingItem: editingPromo,
    showForm: showPromoForm,
    setShowForm: setShowPromoForm,
    setEditingItem: setEditingPromo,
  } = useCrudList<any>({ table: 'promos', activeField: 'active' });

  // Funciones de cierre para modales
  const handleCloseDishModal = () => {
    setShowDishForm(false);
    setEditingDish(null);
  };

  const handleClosePromoModal = () => {
    setShowPromoForm(false);
    setEditingPromo(null);
  };

  // Determinar qué elementos mostrar según la sección actual (solo para el caso SIN búsqueda)
  const itemsToDisplay = seccion === 'dishes' ? dishesData : promosData;

  // Filtrado de elementos según los criterios actuales
  const filteredItems = useMemo(() => {
    const lowerSearchTerm = search.trim().toLowerCase();

    if (lowerSearchTerm) {
      // Búsqueda global: combinar platos y promos
      const allItems = [
        ...(dishesData || []).map((item) => ({ ...item, _sourceType: 'dish' as const })),
        ...(promosData || []).map((item) => ({ ...item, _sourceType: 'promo' as const })),
      ];
      return allItems.filter((item: any) => {
        const name = item.name || item.title || ''; // 'name' para dishes, 'title' para promos
        const description = item.description || '';
        return (
          name.toLowerCase().includes(lowerSearchTerm) ||
          description.toLowerCase().includes(lowerSearchTerm)
        );
      });
    } else {
      // Si no hay término de búsqueda, aplicar filtros de estado y categoría/tipo sobre itemsToDisplay
      if (!itemsToDisplay) return [];
      return itemsToDisplay.filter((item: any) => {
        // 1. Criterio de Estado (solo si no hay búsqueda)
        if (filtro.tipo === 'estado') {
          const isActive = seccion === 'dishes' ? item.available : item.active;
          const matchesStatus = filtro.valor === 'activos' ? isActive : !isActive;
          if (!matchesStatus) {
            return false; // No coincide con el estado, descartar
          }
        }

        // 2. Criterio de Categoría/Tipo (solo si no hay búsqueda)
        if (filtro.tipo === 'categoria') {
          if (seccion === 'dishes') {
            if (item.category !== filtro.valor) {
              return false; // No coincide con la categoría del plato, descartar
            }
          } else if (seccion === 'promos') {
            if (item.type !== filtro.valor) {
              return false; // No coincide con el tipo de promo, descartar
            }
          }
        }
        // Si pasó los filtros de estado/categoría o es 'todos' (y no hay búsqueda)
        return true;
      });
    }
  }, [dishesData, promosData, search, filtro, seccion, itemsToDisplay]);

  // Componente para renderizar la tarjeta correcta en búsqueda global
  const SmartCardRenderer = (props: {
    item: any;
    onToggleActive: (item: any) => void;
    onEdit?: (item: any) => void;
  }) => {
    const { item, onToggleActive, onEdit } = props;
    if (item._sourceType === 'dish') {
      return (
        <DishCard
          item={item}
          onToggleActive={() => onToggleActive(item)}
          onEdit={onEdit ? () => onEdit(item) : undefined}
        />
      );
    } else if (item._sourceType === 'promo') {
      return (
        <PromoCard
          item={item}
          onToggleActive={() => onToggleActive(item)}
          onEdit={onEdit ? () => onEdit(item) : undefined}
        />
      );
    }
    // Fallback o render nulo si el tipo no es reconocido, o si _sourceType no está (no debería pasar con la lógica actual)
    return null;
  };

  const cardForGrid = search.trim().toLowerCase()
    ? SmartCardRenderer
    : seccion === 'dishes'
      ? DishCard
      : PromoCard;

  const dynamicHandleToggleActive = (item: any) => {
    // Usar _sourceType si está disponible (búsqueda global), sino basarse en la sección actual
    const itemType = item._sourceType || (seccion === 'dishes' ? 'dish' : 'promo');
    if (itemType === 'dish') {
      handleToggleActiveDish(item);
    } else {
      // 'promo'
      handleToggleActivePromo(item);
    }
  };

  const dynamicHandleEdit = (item: any) => {
    const itemType = item._sourceType || (seccion === 'dishes' ? 'dish' : 'promo');
    if (itemType === 'dish') {
      handleEditDish(item);
    } else {
      // 'promo'
      handleEditPromo(item);
    }
  };

  const handleNewClick = seccion === 'dishes' ? handleNewDish : handleNewPromo;

  const isLoading = search.trim().toLowerCase()
    ? loadingDishes || loadingPromos
    : seccion === 'dishes'
      ? loadingDishes
      : loadingPromos;

  const currentError = search.trim().toLowerCase()
    ? errorDishes || errorPromos // Muestra el primer error encontrado, o null si ambos son null
    : seccion === 'dishes'
      ? errorDishes
      : errorPromos;

  const displayTitle = useMemo(() => {
    if (search.trim() !== '') {
      return `Resultados de búsqueda en todo para: "${search.trim()}"`;
    }
    if (filtro.tipo === 'categoria' && filtro.valor) {
      if (seccion === 'dishes') {
        const categoryName =
          String(filtro.valor).charAt(0).toUpperCase() + String(filtro.valor).slice(1);
        return `Categoría: ${categoryName}`;
      } else if (seccion === 'promos') {
        // Asumiendo que el valor del filtro de categoría para promos es su tipo
        const promoTypeName =
          String(filtro.valor).charAt(0).toUpperCase() + String(filtro.valor).slice(1);
        return `Tipo de Promoción: ${promoTypeName}`;
      }
    }
    if (filtro.tipo === 'estado' && filtro.valor) {
      const statusName =
        String(filtro.valor).charAt(0).toUpperCase() + String(filtro.valor).slice(1);
      return `${seccion === 'dishes' ? 'Platos' : 'Promociones'}: ${statusName}`;
    }
    if (seccion === 'dishes') return 'Todos los Platos';
    if (seccion === 'promos') return 'Todas las Promociones';
    return 'Dashboard Admin';
  }, [search, filtro, seccion]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavbar
        seccion={seccion}
        setSeccion={setSeccion}
        filtro={filtro}
        setFiltro={setFiltro}
      />
      <main className="flex-1 p-6 space-y-6">
        <AdminHeader
          search={search}
          setSearch={setSearch}
          onAdd={handleNewClick} // Sigue añadiendo según la sección actual
          label={config.addLabel}
          placeholder={config.searchPlaceholder} // Podría mejorarse para búsqueda global
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{displayTitle}</h1>
          <AdminGrid
            items={filteredItems || []}
            loading={isLoading}
            error={currentError}
            onToggleActive={dynamicHandleToggleActive}
            onEdit={dynamicHandleEdit}
            CardComponent={cardForGrid}
          />
        </div>

        {/* Modal para edición de platos - Renderizar si showDishForm es true */}
        {showDishForm && (
          <Modal
            title={
              editingDish?.id
                ? sectionConfigs.dishes.modalTitleEdit
                : sectionConfigs.dishes.modalTitleNew
            }
            isOpen={showDishForm}
            onClose={handleCloseDishModal}
            maxWidth="max-w-xl"
          >
            <DishForm
              initialValues={editingDish || {}} // Asegurar que initialValues no sea null
              onSave={handleSaveDish}
              onCancel={handleCloseDishModal}
            />
          </Modal>
        )}

        {/* Modal para edición de promociones - Renderizar si showPromoForm es true */}
        {showPromoForm && (
          <Modal
            title={
              editingPromo?.id
                ? sectionConfigs.promos.modalTitleEdit
                : sectionConfigs.promos.modalTitleNew
            }
            isOpen={showPromoForm}
            onClose={handleClosePromoModal}
            maxWidth="max-w-xl"
          >
            <PromoForm
              initialValues={editingPromo || {}} // Asegurar que initialValues no sea null
              onSave={handleSavePromo}
              onCancel={handleClosePromoModal}
            />
          </Modal>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
