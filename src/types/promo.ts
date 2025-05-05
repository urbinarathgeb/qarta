/**
 * Interface que representa una promoción
 */
export interface Promo {
    id?: string;
    title: string;
    subtitle?: string;
    description?: string;
    price?: number;
    image_url?: string;
    start_date?: string;
    end_date?: string;
    active: boolean;
    type: PromoType;
    dish_id?: string;
    options?: string[];
    created_at?: string;
}

/**
 * Tipos de promociones disponibles
 */
export enum PromoType {
    DESCUENTO = 'descuento',
    ESPECIAL = 'especial',
    OFERTA = 'oferta'
}

/**
 * Props para el formulario de promociones
 */
export interface PromoFormProps {
    initialValues?: Partial<Promo>;
    onSave: (promo: Partial<Promo>) => void;
    onCancel: () => void;
} 