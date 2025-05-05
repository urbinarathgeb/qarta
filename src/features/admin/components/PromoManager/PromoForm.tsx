import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui';
import { FormField } from '@/components/ui/molecules';
import type { Promo, PromoFormProps } from '@/types/promo';
import { PromoType } from '@/types/promo';

/**
 * Componente para crear y editar promociones
 */
const PromoForm: React.FC<PromoFormProps> = ({
    initialValues = {},
    onSave,
    onCancel,
}) => {
    const [title, setTitle] = useState(initialValues.title || '');
    const [description, setDescription] = useState(initialValues.description || '');
    const [imageUrl, setImageUrl] = useState(initialValues.image_url || '');
    const [startDate, setStartDate] = useState(initialValues.start_date || '');
    const [endDate, setEndDate] = useState(initialValues.end_date || '');
    const [type, setType] = useState<PromoType | undefined>(initialValues.type);
    const [dishId, setDishId] = useState(initialValues.dish_id || '');
    const [price, setPrice] = useState(initialValues.price || 0);
    const [active, setActive] = useState(initialValues.active ?? true);
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});
    const [dishOptions, setDishOptions] = useState<{ id: string; name: string; price: number }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        setTitle(initialValues.title || '');
        setDescription(initialValues.description || '');
        setImageUrl(initialValues.image_url || '');
        setStartDate(initialValues.start_date || '');
        setEndDate(initialValues.end_date || '');
        setType(initialValues.type);
        setDishId(initialValues.dish_id || '');
        setPrice(initialValues.price || 0);
        setActive(initialValues.active ?? true);
        setErrors({});

        // Establecer la imagen de vista previa si existe
        if (initialValues.image_url) {
            setPreviewImage(initialValues.image_url);
        } else {
            setPreviewImage(null);
        }
    }, [initialValues]);

    useEffect(() => {
        async function fetchDishes() {
            const { data, error } = await supabase
                .from('dishes')
                .select('id, name, price')
                .eq('available', true)
                .order('name', { ascending: true });

            if (error) {
                console.error('Error al cargar platos:', error);
            } else if (data) {
                setDishOptions(data);
            }
        }

        fetchDishes();
    }, []);

    // Actualizar la vista previa cuando cambia la URL de la imagen
    useEffect(() => {
        if (imageUrl) {
            setPreviewImage(imageUrl);
        } else {
            setPreviewImage(null);
        }
    }, [imageUrl]);

    function validate() {
        const newErrors: { [key: string]: string } = {};
        if (!title.trim()) newErrors.title = 'El título es obligatorio';
        if (type === PromoType.DESCUENTO && !dishId) newErrors.dishId = 'Debes seleccionar un plato';
        if (!startDate) newErrors.startDate = 'La fecha de inicio es obligatoria';
        if (endDate && new Date(endDate) < new Date(startDate)) {
            newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }
        return newErrors;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validation = validate();
        setErrors(validation);

        if (Object.keys(validation).length > 0) return;

        setIsSubmitting(true);

        try {
            await onSave({
                title: title.trim(),
                description: description.trim() || undefined,
                image_url: imageUrl.trim() || undefined,
                start_date: startDate,
                end_date: endDate || undefined,
                type,
                dish_id: type === PromoType.DESCUENTO ? dishId : undefined,
                price: Number(price) || undefined,
                active,
            });
        } catch (error) {
            console.error('Error al guardar promoción:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const promoTypes = [
        { value: PromoType.DESCUENTO, label: 'Promoción de plato' },
        { value: PromoType.OFERTA, label: 'Promoción general' },
        { value: PromoType.ESPECIAL, label: 'Evento especial' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <FormField
                        label="Título"
                        htmlFor="title"
                        error={errors.title}
                        required
                    >
                        <input
                            id="title"
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </FormField>

                    <FormField
                        label="Descripción"
                        htmlFor="description"
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
                        label="Tipo de promoción"
                        htmlFor="type"
                    >
                        <select
                            id="type"
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            value={type || ''}
                            onChange={(e) => setType(e.target.value as PromoType)}
                        >
                            <option value="">Selecciona un tipo</option>
                            {promoTypes.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {type === PromoType.DESCUENTO && (
                        <FormField
                            label="Plato asociado"
                            htmlFor="dish_id"
                            error={errors.dishId}
                        >
                            <select
                                id="dish_id"
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                value={dishId}
                                onChange={(e) => {
                                    setDishId(e.target.value);
                                    const selectedDish = dishOptions.find(d => d.id === e.target.value);
                                    if (selectedDish) {
                                        setPrice(selectedDish.price);
                                    }
                                }}
                            >
                                <option value="">Selecciona un plato</option>
                                {dishOptions.map(dish => (
                                    <option key={dish.id} value={dish.id}>
                                        {dish.name} (${dish.price.toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    )}

                    <FormField
                        label="Precio promocional"
                        htmlFor="price"
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
                </div>

                <div className="space-y-4">
                    <FormField
                        label="Fecha de inicio"
                        htmlFor="start_date"
                        error={errors.startDate}
                        required
                    >
                        <input
                            id="start_date"
                            type="date"
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </FormField>

                    <FormField
                        label="Fecha de fin"
                        htmlFor="end_date"
                        error={errors.endDate}
                    >
                        <input
                            id="end_date"
                            type="date"
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </FormField>

                    <FormField
                        label="URL de imagen"
                        htmlFor="image_url"
                    >
                        <input
                            id="image_url"
                            type="url"
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </FormField>

                    {previewImage && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Vista previa:</p>
                            <div className="w-full h-40 bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                <img
                                    src={previewImage}
                                    alt="Vista previa"
                                    className="w-full h-full object-cover"
                                    onError={() => setPreviewImage(null)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center mt-4">
                        <input
                            id="active"
                            type="checkbox"
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                        />
                        <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                            Promoción activa
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-lg"
                >
                    {initialValues.id ? 'Guardar cambios' : 'Crear promoción'}
                </Button>
            </div>
        </form>
    );
};

export default PromoForm; 