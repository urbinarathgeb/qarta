import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatPriceCLP } from '@/utils/formatting';
import type { Dish } from '@/types/dish';
import { DishCategory } from '@/types/dish';

interface MenuDisplayProps {
    category?: DishCategory;
}

/**
 * Componente que muestra los platos disponibles en el menú público
 */
const MenuDisplay: React.FC<MenuDisplayProps> = ({ category }) => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<DishCategory | 'all'>(category || 'all');

    // Función para obtener platos de Supabase
    const fetchDishes = async () => {
        setLoading(true);
        setError(null);

        try {
            // Construir la consulta base
            let query = supabase
                .from('dishes')
                .select('*')
                .eq('available', true); // Solo platos disponibles

            // Filtrar por categoría si es necesario
            if (activeCategory !== 'all') {
                query = query.eq('category', activeCategory);
            }

            // Ejecutar la consulta
            const { data, error: fetchError } = await query.order('name');

            if (fetchError) {
                setError(fetchError.message);
                console.error('Error al cargar platos:', fetchError);
            } else {
                setDishes(data || []);
            }
        } catch (err) {
            setError('Error inesperado al cargar platos');
            console.error('Error inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar platos al montar el componente o cambiar la categoría
    useEffect(() => {
        fetchDishes();
    }, [activeCategory]);

    // Establecer una suscripción en tiempo real a cambios en la tabla dishes
    useEffect(() => {
        // Suscribirse a cambios en la tabla dishes
        const subscription = supabase
            .channel('public:dishes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'dishes' }, () => {
                // Cuando hay un cambio, refrescar los datos
                fetchDishes();
            })
            .subscribe();

        // Limpiar la suscripción al desmontar
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Opciones de categorías para el filtro
    const categoryOptions = [
        { value: 'all', label: 'Todos los platos' },
        ...Object.values(DishCategory).map(cat => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1)
        }))
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Encabezado del menú */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Nuestro Menú</h2>
                <p className="text-gray-600">Descubre nuestros deliciosos platos</p>
            </div>

            {/* Filtro de categorías */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categoryOptions.map(option => (
                    <button
                        key={option.value}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === option.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        onClick={() => setActiveCategory(option.value as DishCategory | 'all')}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Estado de carga y error */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">Cargando platos...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Grilla de platos */}
            {!loading && !error && dishes.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No hay platos disponibles en esta categoría.
                </div>
            )}

            {!loading && !error && dishes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dishes.map(dish => (
                        <div key={dish.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            {dish.image_url && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={dish.image_url}
                                        alt={dish.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold mb-1">{dish.name}</h3>
                                    <span className="bg-primary text-white text-sm font-bold px-2 py-1 rounded">
                                        {formatPriceCLP(dish.price)}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                        {dish.category}
                                    </span>
                                    <button className="px-3 py-1 bg-primary text-white text-sm font-medium rounded hover:bg-accent transition-colors">
                                        Ordenar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuDisplay; 