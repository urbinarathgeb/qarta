import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StatusFilter from "./StatusFilter";
import Loader from "./Loader";
import { formatPriceCLP } from "../utils/format";
import { useCrudList } from "./useCrudList";
import { filtrarPorEstado } from "./promoUtils";
import CrudCardList from "./CrudCardList";
import type { CrudCardField } from "./CrudCardList";

export interface Dish {
  id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image_url?: string;
  category?: string;
}

interface DishFormProps {
  initialValues?: Partial<Dish>;
  onSave: (dish: Partial<Dish>) => void;
  onCancel: () => void;
}

const DishForm: React.FC<DishFormProps> = ({ initialValues = {}, onSave, onCancel }) => {
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [price, setPrice] = useState(initialValues.price || 0);
  const [category, setCategory] = useState(initialValues.category || "");
  const [available, setAvailable] = useState(initialValues.available ?? true);
  const [imageUrl, setImageUrl] = useState(initialValues.image_url || "");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setName(initialValues.name || "");
    setDescription(initialValues.description || "");
    setPrice(initialValues.price || 0);
    setCategory(initialValues.category || "");
    setAvailable(initialValues.available ?? true);
    setImageUrl(initialValues.image_url || "");
    setErrors({});
  }, [initialValues]);

  function validate() {
    const newErrors: {[key: string]: string} = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!description.trim()) newErrors.description = "La descripción es obligatoria";
    if (isNaN(price) || price < 0) newErrors.price = "El precio debe ser un número positivo";
    if (!category.trim()) newErrors.category = "La categoría es obligatoria";
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
      category: category.trim(),
      available,
      image_url: imageUrl.trim() || undefined,
    });
  }

  return (
    <form className="bg-white border border-border rounded-lg p-6 flex flex-col gap-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">{initialValues.id ? "Editar Plato" : "Nuevo Plato"}</h2>
      <label className="font-semibold">Nombre
        <input type="text" className="mt-1 block w-full border border-border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
      </label>
      <label className="font-semibold">Descripción
        <textarea className="mt-1 block w-full border border-border rounded px-3 py-2" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
      </label>
      <label className="font-semibold">Precio
        <input type="number" min={0} step={1} className="mt-1 block w-full border border-border rounded px-3 py-2" value={price} onChange={e => setPrice(Number(e.target.value))} required />
        {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
      </label>
      <label className="font-semibold">Categoría
        <select className="mt-1 block w-full border border-border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="">Selecciona una categoría</option>
          <option value="pizza">Pizza</option>
          <option value="bebida">Bebidas</option>
          <option value="postre">Postre</option>
        </select>
        {errors.category && <span className="text-red-500 text-xs">{errors.category}</span>}
      </label>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
        Disponible
      </label>
      <label className="font-semibold">URL de imagen (opcional)
        <input type="url" className="mt-1 block w-full border border-border rounded px-3 py-2" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </label>
      <div className="flex gap-4 mt-4">
        <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition">
          {initialValues.id ? "Guardar Cambios" : "Crear Plato"}
        </button>
        <button type="button" className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

const AdminDishes: React.FC = () => {
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
    table: "dishes",
    defaultFilter: "all",
    activeField: "available",
  });

  // Filtro visual usando helper genérico
  const dishesToShow = filtrarPorEstado(dishes, filter, showForm, "available");

  // Definición de campos para la card
  const dishFields: CrudCardField<Dish>[] = [
    { label: "Nombre", accessor: "name" },
    { label: "Descripción", accessor: "description" },
    { label: "Precio", accessor: "price", render: (d) => formatPriceCLP(d.price) },
    { label: "Categoría", accessor: "category" },
    { label: "Disponible", accessor: "available", render: (d) => d.available ? <span className="text-green-600">Sí</span> : <span className="text-gray-400">No</span> },
  ];

  return (
    <main className="min-h-screen bg-background font-serif py-8 w-full">
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {!showForm && (
        <StatusFilter value={filter} onChange={setFilter} labels={{all: "Todos", active: "Solo activos", inactive: "Solo inactivos"}} />
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
            <button className="px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition" onClick={handleNew}>+ Nuevo Plato</button>
          </div>
          <div className="w-full max-w-screen-2xl mx-auto px-4">
            <CrudCardList
              items={dishesToShow}
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
