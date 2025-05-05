import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatPriceCLP, formatDate } from '@/utils/formatting';
import type { Promo } from '@/types/promo';

/**
 * Componente que muestra las promociones activas del restaurante
 */
const PromoDisplay: React.FC = () => {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener promociones activas de Supabase
    const fetchPromos = async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener solo promociones activas y vigentes (con fecha final posterior a hoy o sin fecha final)
            const today = new Date().toISOString().split('T')[0];

            const { data, error: fetchError } = await supabase
                .from('promos')
                .select('*')
                .eq('active', true)
                .or(`end_date.gt.${today},end_date.is.null`)
                .order('created_at', { ascending: false });

            if (fetchError) {
                setError(fetchError.message);
                console.error('Error al cargar promociones:', fetchError);
            } else {
                setPromos(data || []);
            }
        } catch (err) {
            setError('Error inesperado al cargar promociones');
            console.error('Error inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar promociones al montar el componente
    useEffect(() => {
        fetchPromos();
    }, []);

    // Establecer una suscripción en tiempo real a cambios en la tabla promos
    useEffect(() => {
        const subscription = supabase
            .channel('public:promos')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'promos' }, () => {
                fetchPromos();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Encabezado */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Promociones Especiales</h2>
                <p className="text-gray-600">Descubre nuestras ofertas limitadas</p>
            </div>

            {/* Estado de carga y error */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-gray-600">Cargando promociones...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Sin promociones */}
            {!loading && !error && promos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No hay promociones activas en este momento.
                </div>
            )}

            {/* Lista de promociones */}
            {!loading && !error && promos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {promos.map(promo => (
                        <div
                            key={promo.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                        >
                            {/* Imagen de la promoción */}
                            {promo.image_url ? (
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={promo.image_url}
                                        alt={promo.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Promoción';
                                        }}
                                    />
                                    {/* Badge de tipo de promoción */}
                                    <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-3 rounded-full text-xs font-bold">
                                        {promo.type}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-40 bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                                    <h3 className="text-2xl font-bold px-4 text-center">{promo.title}</h3>
                                </div>
                            )}

                            {/* Contenido de la promoción */}
                            <div className="p-5">
                                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                                {promo.description && (
                                    <p className="text-gray-600 mb-4">{promo.description}</p>
                                )}

                                {/* Fechas de validez */}
                                <div className="flex flex-col gap-1 mb-4">
                                    <div className="flex items-center text-sm">
                                        <span className="font-medium text-gray-700">Inicia: </span>
                                        <span className="ml-2 text-gray-600">{formatDate(promo.start_date || '')}</span>
                                    </div>
                                    {promo.end_date && (
                                        <div className="flex items-center text-sm">
                                            <span className="font-medium text-gray-700">Finaliza: </span>
                                            <span className="ml-2 text-gray-600">{formatDate(promo.end_date)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Precio */}
                                {promo.price && (
                                    <div className="bg-green-50 p-3 rounded-lg mb-4 text-center">
                                        <span className="text-lg font-bold text-green-700">
                                            {formatPriceCLP(promo.price)}
                                        </span>
                                    </div>
                                )}

                                {/* Botón de acción */}
                                <button className="w-full bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded transition-colors">
                                    Aprovechar oferta
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PromoDisplay; 