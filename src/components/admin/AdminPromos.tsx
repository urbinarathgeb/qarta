import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FilterTabs } from "@/components/ui/molecules";
import { formatPriceCLP, formatDate } from "@/utils/formatting";
import { EntityCardGrid } from "@/components/ui/organisms";
import type { EntityCardField } from "@/components/ui/organisms";
import { filtrarPorEstado } from "@/lib/promoUtils";
import { useCrudList } from "@/hooks/useCrudList";
import { logError } from "@/utils/error";

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

const PromoForm: React.FC<PromoFormProps> = ({
  initialValues = {},
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(
    initialValues.title || ""
  );
  const [description, setDescription] = useState(
    initialValues.description || ""
  );
  const [imageUrl, setImageUrl] = useState(
    initialValues.image_url || ""
  );
  const [startDate, setStartDate] = useState(
    initialValues.start_date || ""
  );
  const [endDate, setEndDate] = useState(
    initialValues.end_date || ""
  );
  const [type, setType] = useState(
    initialValues.type || ""
  );
  const [dishId, setDishId] = useState(
    initialValues.dish_id || ""
  );
  const [price, setPrice] = useState(
    initialValues.price || 0
  );
  const [active, setActive] = useState(
    initialValues.active ?? true
  );
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const [dishOptions, setDishOptions] = useState<
    DishOption[]
  >([]);
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
    if (
      type === "descuento" &&
      dishId &&
      dishOptions.length > 0
    ) {
      const selected = dishOptions.find(
        (d) => d.id === dishId
      );
      if (selected) {
        if (!title) setTitle(selected.name);
        if (!description)
          setDescription(selected.description || "");
      }
    }
    // eslint-disable-next-line
  }, [dishId, type, dishOptions]);

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim())
      newErrors.title = "El título es obligatorio";
    if (!type.trim())
      newErrors.type = "El tipo es obligatorio";
    if (type === "descuento" && !dishId.trim())
      newErrors.dish_id =
        "El plato es obligatorio para descuento";
    if (
      (type === "precio" || type === "descuento") &&
      (!price || price <= 0)
    )
      newErrors.price = "El precio debe ser mayor que 0";
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
    <form
      className="bg-white border border-border rounded-lg p-6 flex flex-col gap-4 w-full max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-2">
        {initialValues.id ? "Editar Promo" : "Nueva Promo"}
      </h2>
      <label className="font-semibold">
        Título
        <input
          type="text"
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {errors.title && (
          <span className="text-red-500 text-xs">
            {errors.title}
          </span>
        )}
      </label>
      <label className="font-semibold">
        Descripción
        <textarea
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="font-semibold">
        Imagen (URL)
        <input
          type="url"
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </label>
      <label className="font-semibold">
        Fecha inicio
        <input
          type="date"
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label className="font-semibold">
        Fecha fin
        <input
          type="date"
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <label className="font-semibold">
        Tipo
        <select
          className="mt-1 block w-full border border-border rounded px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Selecciona tipo</option>
          <option value="descuento">Descuento</option>
          <option value="precio">Precio fijo</option>
        </select>
        {errors.type && (
          <span className="text-red-500 text-xs">
            {errors.type}
          </span>
        )}
      </label>
      {type === "descuento" && (
        <>
          <label className="font-semibold">
            Plato asociado
            <select
              className="mt-1 block w-full border border-border rounded px-3 py-2"
              value={dishId}
              onChange={(e) => setDishId(e.target.value)}
              required
              disabled={loadingDishes}
            >
              <option value="">Selecciona un plato</option>
              {dishOptions.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name}
                </option>
              ))}
            </select>
            {errors.dish_id && (
              <span className="text-red-500 text-xs">
                {errors.dish_id}
              </span>
            )}
          </label>
          <label className="font-semibold mt-2">
            Precio promocional
            <input
              type="number"
              className="mt-1 block w-full border border-border rounded px-3 py-2"
              value={price || ""}
              min="0"
              step="0.01"
              onChange={(e) =>
                setPrice(Number(e.target.value))
              }
              required
            />
            {(() => {
              const selected = dishOptions.find(
                (d) => d.id === dishId
              );
              return selected &&
                selected.price !== undefined ? (
                <div className="text-xs text-muted mt-1">
                  Precio original:{" "}
                  {formatPriceCLP(selected.price)}
                </div>
              ) : null;
            })()}
            {errors.price && (
              <span className="text-red-500 text-xs">
                {errors.price}
              </span>
            )}
          </label>
        </>
      )}
      {type === "precio" && (
        <label className="font-semibold">
          Precio fijo
          <input
            type="number"
            className="mt-1 block w-full border border-border rounded px-3 py-2"
            value={price || ""}
            min="0"
            step="0.01"
            onChange={(e) =>
              setPrice(Number(e.target.value))
            }
            required
          />
          {errors.price && (
            <span className="text-red-500 text-xs">
              {errors.price}
            </span>
          )}
        </label>
      )}
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Activa
      </label>
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition"
        >
          {initialValues.id
            ? "Guardar Cambios"
            : "Crear Promo"}
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

const AdminPromos: React.FC = () => {
  const {
    items: promos,
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
  } = useCrudList<Promo>({
    table: "promos",
    defaultFilter: "all",
    activeField: "active",
  });

  // Manejo de errores mejorado
  useEffect(() => {
    if (error) {
      logError(error, 'AdminPromos');
    }
  }, [error]);

  // Filtro visual (ahora usando helper genérico)
  const promosToShow = filtrarPorEstado(
    promos,
    filter,
    showForm,
    "active"
  );

  // Definición de campos para la card
  const promoFields: EntityCardField<Promo>[] = [
    { key: "title", label: "Título", accessor: "title" },
    { key: "type", label: "Tipo", accessor: "type" },
    {
      key: "start_date",
      label: "Inicio",
      accessor: "start_date",
      formatter: (value) => formatDate(value as string),
    },
    {
      key: "end_date",
      label: "Fin",
      accessor: "end_date",
      formatter: (value) => formatDate(value as string),
    },
    {
      key: "active",
      label: "Activo",
      accessor: "active",
    },
  ];

  return (
    <main className="min-h-screen bg-background font-serif py-8 w-full">
      {error && (
        <p className="text-red-500 text-center mb-4">
          Error: {error}
        </p>
      )}
      {!showForm && (
        <div className="mb-4 flex gap-2 justify-center">
          <FilterTabs
            options={[
              { value: "all", label: "Todas" },
              { value: "active", label: "Solo activas", colorClass: "bg-green-600" },
              { value: "inactive", label: "Solo inactivas", colorClass: "bg-gray-400" }
            ]}
            value={filter}
            onChange={(value) => setFilter(value as "all" | "active" | "inactive")}
          />
        </div>
      )}
      {showForm ? (
        <PromoForm
          initialValues={editingItem || {}}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <button
            className="mb-4 px-4 py-2 bg-primary text-white rounded font-bold hover:bg-accent transition"
            onClick={handleNew}
          >
            Nueva promoción
          </button>
          <div className="w-full max-w-screen-2xl mx-auto px-4">
            <EntityCardGrid
              items={promosToShow}
              fields={promoFields}
              loading={loading}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              emptyMessage="No hay promociones"
            />
          </div>
        </>
      )}
    </main>
  );
};

export default AdminPromos;
