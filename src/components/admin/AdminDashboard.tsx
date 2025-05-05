// src/components/admin/AdminDashboard.tsx
import React, { useState } from 'react';
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
import { Button } from '@/components/ui';

type Seccion = 'dishes' | 'promos';

const AdminDashboard: React.FC = () => {
  const [seccion, setSeccion] = useState<Seccion>('dishes');
  const [filtro, setFiltro] = useState<Filtro>({ tipo: 'todos' });
  const [search, setSearch] = useState('');

  // Dishes
  const {
    items: dishes,
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
  } = useCrudList({ table: 'dishes', activeField: 'available' });

  // Promos
  const {
    items: promos,
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
  } = useCrudList({ table: 'promos', activeField: 'active' });

  // Manejadores para cerrar modales
  const handleCloseDishModal = () => {
    setShowDishForm(false);
    setEditingDish(null);
  };

  const handleClosePromoModal = () => {
    setShowPromoForm(false);
    setEditingPromo(null);
  };

  // Filtrado
  const itemsFiltrados = (seccion === 'dishes' ? dishes : promos).filter((item) => {
    // Filtro por sidebar
    let matchFiltro = true;
    if (filtro.tipo === 'estado') {
      matchFiltro =
        filtro.valor === 'activos'
          ? (item.available ?? item.active)
          : !(item.available ?? item.active);
    } else if (filtro.tipo === 'categoria') {
      matchFiltro = item.category === filtro.valor;
    }
    // Filtro por búsqueda
    const nombre = seccion === 'dishes' ? item.name : item.title;
    const matchSearch = nombre.toLowerCase().includes(search.toLowerCase());
    return matchFiltro && matchSearch;
  });

  return (
    <div className="flex min-h-screen">
      <AdminNavbar
        seccion={seccion}
        setSeccion={setSeccion}
        filtro={filtro}
        setFiltro={setFiltro}
      />
      <main className="flex-1 p-6">
        <AdminHeader
          search={search}
          setSearch={setSearch}
          onAdd={seccion === 'dishes' ? handleNewDish : handleNewPromo}
          label={seccion === 'dishes' ? 'Add dish' : 'Add promo'}
        />
        <AdminGrid
          items={itemsFiltrados}
          loading={seccion === 'dishes' ? loadingDishes : loadingPromos}
          error={seccion === 'dishes' ? errorDishes : errorPromos}
          onToggleActive={seccion === 'dishes' ? handleToggleActiveDish : handleToggleActivePromo}
          onEdit={seccion === 'dishes' ? handleEditDish : handleEditPromo}
          CardComponent={seccion === 'dishes' ? DishCard : PromoCard}
        />

        {/* Modal para edición de platos */}
        <Modal
          title={editingDish?.id ? 'Editar Plato' : 'Nuevo Plato'}
          isOpen={showDishForm}
          onClose={handleCloseDishModal}
          maxWidth="max-w-xl"
        >
          <DishForm
            initialValues={editingDish || {}}
            onSave={handleSaveDish}
            onCancel={handleCloseDishModal}
          />
        </Modal>

        {/* Modal para edición de promociones */}
        <Modal
          title={editingPromo?.id ? 'Editar Promoción' : 'Nueva Promoción'}
          isOpen={showPromoForm}
          onClose={handleClosePromoModal}
          maxWidth="max-w-xl"
        >
          <PromoForm
            initialValues={editingPromo || {}}
            onSave={handleSavePromo}
            onCancel={handleClosePromoModal}
          />
        </Modal>
      </main>
    </div>
  );
};

export default AdminDashboard;
