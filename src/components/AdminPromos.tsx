import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface Promo {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  dish_id?: string;
  price?: number;
  active: boolean;
}

interface PromoFormProps {
  initialValues?: Partial<Promo>;
  onSave: (promo: Partial<Promo>) => void;
  onCancel: () => void;
}

interface DishOption {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

const PromoForm: React.FC<PromoFormProps> = ({ initialValues = {}, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [imageUrl, setImageUrl] = useState(initialValues.image_url || "");
  const [startDate, setStartDate] = useState(initialValues.start_date || "");
  const [endDate, setEndDate] = useState(initialValues.end_date || "");
  const [type, setType] = useState(initialValues.type || "");
  const [dishId, setDishId] = useState(initialValues.dish_id || "");
  const [price, setPrice] = useState(initialValues.price || 0);
  const [active, setActive] = useState(initialValues.active ?? true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [dishOptions, setDishOptions] = useState<DishOption[]>([]);
  const [loadingDishes, setLoadingDishes] = useState(false);

  useEffect(() => {
    setTitle(initialValues.title || "");
    setDescription(initialValues.description || "");
    setImageUrl(initialValues.image_url || "");
    setStartDate(initialValues.start_date || "");
    setEndDate(initialValues.end_date || "");
    setType(initialValues.type || "");
    setDishId(initialValues.dish_id || "");
    setPrice(initialValues.price || 0);
    setActive(initialValues.active ?? true);
    setErrors({});
  }, [initialValues]);

  useEffect(() => {
    async function fetchDishes() {
      setLoadingDishes(true);
      const { data, error } = await supabase
        .from("dishes")
        .select("id, name, description, price")
        .order("name", { ascending: true });
      if (!error && data) setDishOptions(data);
      setLoadingDishes(false);
    }
    fetchDishes();
  }, []);

  useEffect(() => {
    if (type === "descuento" && dishId && dishOptions.length > 0) {
      const selected = dishOptions.find(d => d.id === dishId);
      if (selected) {
        if (!title) setTitle(selected.name);
        if (!description) setDescription(selected.description || "");
      }
    }
    // eslint-disable-next-line
  }, [dishId, type, dishOptions]);

  function validate() {
    const newErrors: {[key: string]: string} = {};
    if (!title.trim()) newErrors.title = "El título es obligatorio";
    if (!type.trim()) newErrors.type = "El tipo es obligatorio";
    if (type === "descuento" && !dishId.trim()) newErrors.dish_id = "El plato es obligatorio para descuento";
    if ((type === "precio" || type === "descuento") && (!price || price <= 0)) newErrors.price = "El precio debe ser mayor que 0";
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl.trim() || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      type: type.trim(),
      dish_id: dishId.trim() || undefined,
      price: Number(price) || undefined,
      active,
    });
  }

  return (
    <form className="bg-white border border-border rounded-lg p-6 flex flex-col gap-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">{initialValues.id ? "Editar Promo" : "Nueva Promo"}</h2>
      <label className="font-semibold">Título
        <input type="text" className="mt-1 block w-full border border-border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
        {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
      </label>
      <label className="font-semibold">Descripción
        <textarea className="mt-1 block w-full border border-border rounded px-3 py-2" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <label className="font-semibold">Imagen (URL)
        <input type="url" className="mt-1 block w-full border border-border rounded px-3 py-2" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </label>
      <label className="font-semibold">Fecha inicio
        <input type="date" className="mt-1 block w-full border border-border rounded px-3 py-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </label>
      <label className="font-semibold">Fecha fin
        <input type="date" className="mt-1 block w-full border border-border rounded px-3 py-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </label>
      <label className="font-semibold">Tipo
        <select className="mt-1 block w-full border border-border rounded px-3 py-2" value={type} onChange={e => setType(e.target.value)} required>
          <option value="">Selecciona tipo</option>
          <option value="descuento">Descuento</option>
          <option value="precio">Precio fijo</option>
        </select>
        {errors.type && <span className="text-red-500 text-xs">{errors.type}</span>}
      </label>
      {type === "descuento" && (
        <>
        <label className="font-semibold">Plato asociado
          <select
            className="mt-1 block w-full border border-border rounded px-3 py-2"
            value={dishId}
            onChange={e => setDishId(e.target.value)}
            required
            disabled={loadingDishes}
          >
            <option value="">Selecciona un plato</option>
            {dishOptions.map(dish => (
              <option key={dish.id} value={dish.id}>{dish.name}</option>
            ))}
          </select>
          {errors.dish_id && <span className="text-red-500 text-xs">{errors.dish_id}</span>}
        </label>
        <label className="font-semibold mt-2">Precio promocional
          <input
            type="number"
            className="mt-1 block w-full border border-border rounded px-3 py-2"
            value={price || ""}
            min="0"
            step="0.01"
            onChange={e => setPrice(Number(e.target.value))}
            required
          />
          {(() => {
            const selected = dishOptions.find(d => d.id === dishId);
            return selected && selected.price !== undefined ? (
              <div className="text-xs text-muted mt-1">Precio original: ${selected.price.toLocaleString("es-CL")}</div>
            ) : null;
          })()}
          {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
        </label>
        </>
      )}
      {type === "precio" && (
        <label className="font-semibold">Precio fijo
          <input
            type="number"
            className="mt-1 block w-full border border-border rounded px-3 py-2"
            value={price || ""}
            min="0"
            step="0.01"
            onChange={e => setPrice(Number(e.target.value))}
            required
          />
          {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
        </label>
      )}
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
        Activa
      </label>
      <div className="flex gap-4 mt-4">
        <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition">
          {initialValues.id ? "Guardar Cambios" : "Crear Promo"}
        </button>
        <button type="button" className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

const AdminPromos: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  async function fetchPromos() {
    setLoading(true);
    const { data, error } = await supabase.from("promos").select("*").order("start_date", { ascending: false });
    if (error) setError(error.message);
    else setPromos(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPromos();
  }, []);

  function handleNewPromo() {
    setEditingPromo(null);
    setShowForm(true);
  }

  function handleEditPromo(promo: Promo) {
    setEditingPromo(promo);
    setShowForm(true);
  }

  function handleCancelForm() {
    setEditingPromo(null);
    setShowForm(false);
  }

  async function handleSavePromo(promoData: Partial<Promo>) {
    const allowedFields: (keyof Promo)[] = [
      'title', 'description', 'image_url', 'start_date', 'end_date', 'type', 'dish_id', 'price', 'active'
    ];
    const fullData = editingPromo ? { ...editingPromo, ...promoData } : promoData;
    const updateData: Partial<Promo> = {};
    for (const key of allowedFields) {
      if (fullData[key] !== undefined) updateData[key] = fullData[key];
    }
    if (!editingPromo && updateData.active === undefined) updateData.active = true;
    if (typeof updateData.price === 'string') updateData.price = Number(updateData.price);

    if (editingPromo && editingPromo.id) {
      const { error } = await supabase.from("promos").update(updateData).eq("id", editingPromo.id);
      if (error) alert("Error al actualizar promo: " + error.message);
    } else {
      const { error } = await supabase.from("promos").insert([updateData]);
      if (error) alert("Error al crear promo: " + error.message);
    }
    await fetchPromos();
    setShowForm(false);
    setEditingPromo(null);
  }

  async function handleToggleActive(promo: Promo) {
    const { error } = await supabase.from("promos").update({ active: !promo.active }).eq("id", promo.id);
    if (error) {
      alert("Error al cambiar estado: " + error.message);
    } else {
      await fetchPromos();
    }
  }

  // Filtro visual
  let filteredPromos = promos;
  if (filter === 'active') filteredPromos = promos.filter(p => p.active !== false);
  if (filter === 'inactive') filteredPromos = promos.filter(p => p.active === false);
  const promosToShow = showForm ? promos.filter(p => p.active !== false) : filteredPromos;

  return (
    <main className="max-w-lg mx-auto p-8 min-h-screen bg-background font-serif">
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {!showForm && (
        <div className="mb-4 flex gap-2 justify-center">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>Todas</button>
          <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded ${filter==='active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Solo activas</button>
          <button onClick={() => setFilter('inactive')} className={`px-3 py-1 rounded ${filter==='inactive' ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-700'}`}>Solo inactivas</button>
        </div>
      )}
      {showForm ? (
        <PromoForm
          key={editingPromo?.id || 'new'}
          initialValues={editingPromo || {}}
          onSave={handleSavePromo}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <div className="mb-8 flex justify-end">
            <button className="px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition" onClick={handleNewPromo}>+ Nueva Promo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-border rounded-lg">
              <thead>
                <tr className="bg-primary-light text-accent">
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Inicio</th>
                  <th className="px-4 py-2 text-left">Fin</th>
                  <th className="px-4 py-2">Activa</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>
                ) : promosToShow.length > 0 ? (
                  promosToShow.map((promo) => (
                    <tr key={promo.id} className="border-t border-border">
                      <td className="px-4 py-2 font-semibold">{promo.title}</td>
                      <td className="px-4 py-2 text-xs">{promo.type ?? '-'}</td>
                      <td className="px-4 py-2 text-xs">{promo.start_date ? promo.start_date.slice(0, 10) : '-'}</td>
                      <td className="px-4 py-2 text-xs">{promo.end_date ? promo.end_date.slice(0, 10) : '-'}</td>
                      <td className="px-4 py-2 text-center">
                        <button className={`px-2 py-1 rounded text-xs font-bold ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                          onClick={() => handleToggleActive(promo)}>
                          {promo.active ? 'Activa' : 'Inactiva'}
                        </button>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button className="px-2 py-1 bg-primary-light text-accent rounded hover:bg-primary text-xs" onClick={() => handleEditPromo(promo)}>Editar</button>
                        {/* Aquí puedes agregar botón de eliminar si lo deseas */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No hay promociones registradas.</td></tr>
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

export default AdminPromos;
