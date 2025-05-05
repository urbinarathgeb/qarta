import React, { useEffect, useState } from 'react';
import type { Dish, DishFormProps } from '@/types/dish';
import { DishCategory } from '@/types/dish';
import { Button } from '@/components/ui';
import { FormField } from '@/components/ui/molecules';

/**
 * Formulario para crear y editar platos
 */
const DishForm: React.FC<DishFormProps> = ({
  initialValues = {},
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialValues.name || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [price, setPrice] = useState(initialValues.price || 0);
  const [category, setCategory] = useState<DishCategory | undefined>(initialValues.category);
  const [available, setAvailable] = useState(initialValues.available ?? true);
  const [imageUrl, setImageUrl] = useState(initialValues.image_url || '');
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    // Mostrar indicador de carga
    setIsSubmitting(true);

    try {
      console.log("Guardando plato:", {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        available,
        image_url: imageUrl.trim() || undefined,
      });

      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        available,
        image_url: imageUrl.trim() || undefined,
      });
    } catch (error) {
      console.error('Error al guardar plato:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const categoryOptions = Object.values(DishCategory).map(cat => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1)
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Nombre"
        htmlFor="name"
        error={errors.name}
        required
      >
        <input
          id="name"
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Descripción"
        htmlFor="description"
        error={errors.description}
        required
      >
        <textarea
          id="description"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <FormField
        label="Precio"
        htmlFor="price"
        error={errors.price}
        required
      >
        <input
          id="price"
          type="number"
          min={0}
          step={1}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </FormField>

      <FormField
        label="Categoría"
        htmlFor="category"
        error={errors.category}
        required
      >
        <select
          id="category"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          value={category || ''}
          onChange={(e) => setCategory(e.target.value as DishCategory)}
        >
          <option value="">Selecciona una categoría</option>
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Imagen"
        htmlFor="image-url"
        tip="URL de una imagen para mostrar con el plato (opcional)"
      >
        <input
          id="image-url"
          type="url"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {imageUrl && (
          <div className="mt-2 border rounded p-2">
            <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
            <img
              src={imageUrl}
              alt="Vista previa"
              className="h-40 object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error+de+imagen';
              }}
            />
          </div>
        )}
      </FormField>

      <FormField
        label="Disponibilidad"
        htmlFor="available"
      >
        <div className="flex items-center">
          <input
            type="checkbox"
            id="available"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          <label htmlFor="available" className="ml-2 text-sm text-gray-700">
            Disponible para pedidos
          </label>
        </div>
      </FormField>

      <div className="flex gap-3 justify-end mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-lg"
        >
          {initialValues.id ? 'Guardar Cambios' : 'Crear Plato'}
        </Button>
      </div>
    </form>
  );
};

export default DishForm;
