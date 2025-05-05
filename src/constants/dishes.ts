import { DishCategory } from '@/types/dish';

/**
 * Mapeo de categorías a nombres para mostrar
 */
export const DISH_CATEGORY_LABELS: Record<DishCategory, string> = {
    [DishCategory.PIZZA]: 'Pizza',
    [DishCategory.BEBIDA]: 'Bebida',
    [DishCategory.POSTRE]: 'Postre',
    [DishCategory.PASTA]: 'Pasta',
    [DishCategory.CERVEZA]: 'Cerveza'
};

/**
 * Opciones de categorías para selectores
 */
export const DISH_CATEGORY_OPTIONS = Object.entries(DISH_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label
})); 