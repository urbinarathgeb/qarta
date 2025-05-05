import React, { useEffect, useState } from "react";
import { DishCategory, type DishFormProps } from "@/types/dish";
import { DISH_CATEGORY_OPTIONS } from "@/constants/dishes";

/**
 * Componente de formulario para crear o editar platos
 */
const DishForm: React.FC<DishFormProps> = ({
    initialValues = {},
    onSave,
    onCancel,
}) => {
    const [name, setName] = useState(
        initialValues.name || ""
    );
    const [description, setDescription] = useState(
        initialValues.description || ""
    );
    const [price, setPrice] = useState(
        initialValues.price || 0
    );
    const [category, setCategory] = useState<DishCategory | undefined>(
        initialValues.category
    );
    const [available, setAvailable] = useState(
        initialValues.available ?? true
    );
    const [imageUrl, setImageUrl] = useState(
        initialValues.image_url || ""
    );
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});

    useEffect(() => {
        setName(initialValues.name || "");
        setDescription(initialValues.description || "");
        setPrice(initialValues.price || 0);
        setCategory(initialValues.category);
        setAvailable(initialValues.available ?? true);
        setImageUrl(initialValues.image_url || "");
        setErrors({});
    }, [initialValues]);

    function validate() {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim())
            newErrors.name = "El nombre es obligatorio";
        if (!description.trim())
            newErrors.description =
                "La descripción es obligatoria";
        if (isNaN(price) || price < 0)
            newErrors.price =
                "El precio debe ser un número positivo";
        if (!category)
            newErrors.category = "La categoría es obligatoria";
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
                {initialValues.id ? "Editar Plato" : "Nuevo Plato"}
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
                {errors.name && (
                    <span className="text-red-500 text-xs">
                        {errors.name}
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
                {errors.description && (
                    <span className="text-red-500 text-xs">
                        {errors.description}
                    </span>
                )}
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
                {errors.price && (
                    <span className="text-red-500 text-xs">
                        {errors.price}
                    </span>
                )}
            </label>
            <label className="font-semibold">
                Categoría
                <select
                    className="mt-1 block w-full border border-border rounded px-3 py-2"
                    value={category || ""}
                    onChange={(e) => setCategory(e.target.value as DishCategory)}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {DISH_CATEGORY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <span className="text-red-500 text-xs">
                        {errors.category}
                    </span>
                )}
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
                    {initialValues.id
                        ? "Guardar Cambios"
                        : "Crear Plato"}
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

export default DishForm; 