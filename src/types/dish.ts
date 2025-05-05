/**
 * Interface que representa un plato en el menú
 */
export interface Dish {
    id?: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
    image_url?: string;
    category?: DishCategory;
    created_at?: string;
}

/**
 * Categorías de platos disponibles
 */
export enum DishCategory {
    PIZZA = 'pizza',
    BEBIDA = 'bebida',
    POSTRE = 'postre',
    PASTA = 'pasta',
    CERVEZA = 'cerveza'
}

/**
 * Props para el formulario de platos
 */
export interface DishFormProps {
    initialValues?: Partial<Dish>;
    onSave: (dish: Partial<Dish>) => void;
    onCancel: () => void;
} 