import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Configura tu Supabase (ajusta la URL y la KEY si es necesario)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_KEY:", supabaseKey);
const supabase = createClient(supabaseUrl, supabaseKey);

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
        <input type="text" className="mt-1 block w-full border border-border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)} />
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
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  async function fetchDishes() {
    setLoading(true);
    const { data, error } = await supabase.from("dishes").select("*").order("created_at", { ascending: false });
    console.log("FETCHED DATA:", data);
    console.log("FETCH ERROR:", error);
    if (error) setError(error.message);
    else setDishes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchDishes();
  }, []);

  function handleNewDish() {
    setEditingDish(null);
    setShowForm(true);
  }

  function handleEditDish(dish: Dish) {
    setEditingDish(dish);
    setShowForm(true);
  }

  function handleCancelForm() {
    setEditingDish(null);
    setShowForm(false);
  }

  async function handleSaveDish(dishData: Partial<Dish>) {
    // Solo campos editables
    const allowedFields: (keyof Dish)[] = ['name', 'description', 'price', 'category', 'available', 'image_url'];
    const fullData = editingDish ? { ...editingDish, ...dishData } : dishData;
    const updateData: Partial<Dish> = {};
    for (const key of allowedFields) {
      if (fullData[key] !== undefined) updateData[key] = fullData[key];
    }
    if (typeof updateData.price === 'string') updateData.price = Number(updateData.price);
    // Si es nuevo plato, forzar available: true por defecto
    if (!editingDish && updateData.available === undefined) updateData.available = true;

    console.log("GUARDANDO:", updateData, "EDITANDO:", editingDish);
    if (editingDish && editingDish.id) {
      const { error } = await supabase.from("dishes").update(updateData).eq("id", editingDish.id);
      console.log("UPDATE ERROR:", error);
    } else {
      const { error } = await supabase.from("dishes").insert([updateData]);
      console.log("INSERT ERROR:", error);
    }
    await fetchDishes();
    setShowForm(false);
    setEditingDish(null);
  }

  async function handleToggleAvailable(dish: Dish) {
    const { error } = await supabase.from("dishes").update({ available: !dish.available }).eq("id", dish.id);
    if (error) {
      alert("Error al cambiar disponibilidad: " + error.message);
    } else {
      await fetchDishes();
    }
  }

  // Filtro visual
  let filteredDishes = dishes;
  if (filter === 'active') filteredDishes = dishes.filter(d => d.available !== false);
  if (filter === 'inactive') filteredDishes = dishes.filter(d => d.available === false);
  const dishesToShow = showForm ? dishes.filter(d => d.available !== false) : filteredDishes;

  return (
    <main className="max-w-lg mx-auto p-8 min-h-screen bg-background font-serif">
      <h1 className="text-2xl font-bold mb-6 text-center">Administrar Platos</h1>
      <p className="text-center text-muted mb-8">Aquí podrás crear, editar y eliminar platos del menú.</p>
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {!showForm && (
        <div className="mb-4 flex gap-2 justify-center">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>Todos</button>
          <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded ${filter==='active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Solo activos</button>
          <button onClick={() => setFilter('inactive')} className={`px-3 py-1 rounded ${filter==='inactive' ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-700'}`}>Solo inactivos</button>
        </div>
      )}
      {showForm ? (
        <DishForm
          key={editingDish?.id || 'new'}
          initialValues={editingDish || {}}
          onSave={handleSaveDish}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <div className="mb-8 flex justify-end">
            <button className="px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition" onClick={handleNewDish}>+ Nuevo Plato</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-border rounded-lg">
              <thead>
                <tr className="bg-primary-light text-accent">
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Descripción</th>
                  <th className="px-4 py-2 text-left">Precio</th>
                  <th className="px-4 py-2 text-left">Categoría</th>
                  <th className="px-4 py-2">Disponible</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>
                ) : dishesToShow.length > 0 ? (
                  dishesToShow.map((dish) => (
                    <tr key={dish.id} className="border-t border-border">
                      <td className="px-4 py-2 font-semibold">{dish.name}</td>
                      <td className="px-4 py-2 text-sm text-muted">{dish.description}</td>
                      <td className="px-4 py-2">${dish.price.toLocaleString('es-CL')}</td>
                      <td className="px-4 py-2 text-xs">{dish.category ?? '-'}</td>
                      <td className="px-4 py-2 text-center">
                        <button className={`px-2 py-1 rounded text-xs font-bold ${dish.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                          onClick={() => handleToggleAvailable(dish)}>
                          {dish.available ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button className="px-2 py-1 bg-primary-light text-accent rounded hover:bg-primary text-xs" onClick={() => handleEditDish(dish)}>Editar</button>
                        {/* Eliminar irá aquí */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No hay platos registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      <a href="/admin" className="block mt-10 text-primary hover:underline text-center">Volver al panel principal</a>
    </main>
  );
};

export default AdminDishes;
