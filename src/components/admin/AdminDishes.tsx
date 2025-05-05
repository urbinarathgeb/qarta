import React, { useEffect, useState } from 'react';
import { FilterTabs } from '@/components/ui/molecules';
import { formatPriceCLP } from '@/utils/formatting';
import { useCrudList } from '@/hooks/useCrudList';
import { filtrarPorEstado } from '@/lib/promoUtils';
import { EntityCardGrid } from '@/components/ui/organisms';
import type { EntityCardField } from '@/components/ui/organisms';
import type { Dish, DishFormProps } from '@/types/dish';
import { DishCategory } from '@/types/dish';
import { logError, formatErrorMessage } from '@/utils/error';

const DishForm: React.FC<DishFormProps> = ({ initialValues = {}, onSave, onCancel }) => {
  const [name, setName] = useState(initialValues.name || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [price, setPrice] = useState(initialValues.price || 0);
  const [category, setCategory] = useState<DishCategory | undefined>(initialValues.category);
  const [available, setAvailable] = useState(initialValues.available ?? true);
  const [imageUrl, setImageUrl] = useState(initialValues.image_url || '');
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    setName(initialValues.name || '');
    setDescription(initialValues.description || '');
    setPrice(initialValues.price || 0);
    setCategory(initialValues.category);
    setAvailable(initialValues.available ?? true);
    setImageUrl(initialValues.image_url || '');
    setErrors({});
  }, [initialValues]);

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (isNaN(price) || price < 0) newErrors.price = 'El precio debe ser un número positivo';
    if (!category) newErrors.category = 'La categoría es obligatoria';
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    // Solo enviar campos válidos
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      available,
      image_url: imageUrl.trim() || undefined,
    });
  }

  return (
    <form
      className="bg-white border border-border rounded-lg p-6 flex flex-col gap-4 w-full max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-2">
        {initialValues.id ? 'Editar Plato' : 'Nuevo Plato'}
      </h2>
      <label className="font-semibold">
        Nombre
        <input
          type="text"
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
      </label>
      <label className="font-semibold">
        Descripción
        <textarea
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
      </label>
      <label className="font-semibold">
        Precio
        <input
          type="number"
          min={0}
          step={1}
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
      </label>
      <label className="font-semibold">
        Categoría
        <select
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={category || ''}
          onChange={(e) => setCategory(e.target.value as DishCategory)}
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value={DishCategory.PIZZA}>Pizza</option>
          <option value={DishCategory.BEBIDA}>Bebidas</option>
          <option value={DishCategory.POSTRE}>Postre</option>
          <option value={DishCategory.PASTA}>Pasta</option>
          <option value={DishCategory.CERVEZA}>Cerveza</option>
        </select>
        {errors.category && <span className="text-red-500 text-xs">{errors.category}</span>}
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
        />
        Disponible
      </label>
      <label className="font-semibold">
        URL de imagen (opcional)
        <input
          type="url"
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </label>
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition"
        >
          {initialValues.id ? 'Guardar Cambios' : 'Crear Plato'}
        </button>
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

const AdminDishes: React.FC<{ filtro: any }> = ({ filtro }) => {
  const {
    items: dishes,
    loading,
    error,
    showForm,
    editingItem,
    filter,
    setFilter,
    handleNew,
    handleEdit,
    handleCancelForm,
    handleSave,
    handleToggleActive,
    setShowForm,
    setEditingItem,
  } = useCrudList<Dish>({
    table: 'dishes',
    defaultFilter: 'all',
    activeField: 'available',
  });

  // Utiliza el manejador de errores mejorado
  useEffect(() => {
    if (error) {
      logError(error, 'AdminDishes');
    }
  }, [error]);

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
    { key: 'name', label: 'Nombre', accessor: 'name' },
    { key: 'description', label: 'Descripción', accessor: 'description' },
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

  return (
    <main className="min-h-screen bg-background font-serif py-8 w-full">
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {!showForm && (
        <FilterTabs
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Solo activos', colorClass: 'bg-green-600' },
            { value: 'inactive', label: 'Solo inactivos', colorClass: 'bg-gray-400' },
          ]}
          value={filter}
          onChange={(value) => setFilter(value as 'all' | 'active' | 'inactive')}
        />
      )}
      {showForm ? (
        <DishForm
          initialValues={editingItem || {}}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <div className="mb-8 flex justify-end">
            <button
              className="px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition"
              onClick={handleNew}
            >
              + Nuevo Plato
            </button>
          </div>
          <div className="w-full max-w-screen-2xl mx-auto px-4">
            <EntityCardGrid
              items={dishesFiltrados}
              fields={dishFields}
              loading={loading}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              emptyMessage="No hay platos registrados."
            />
          </div>
        </>
      )}
    </main>
  );
};

export default AdminDishes;
