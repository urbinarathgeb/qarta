/**
 * Categorías de platos disponibles
 */
export enum DishCategory {
  PIZZA = 'pizza',
  BEBIDA = 'bebida',
  POSTRE = 'postre',
  PASTA = 'pasta',
  CERVEZA = 'cerveza',
}

/**
 * Interface que representa un plato en el menú
 */
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image_url?: string;
  category: string | DishCategory; // Permitimos string para compatibilidad con la BD
  created_at?: string;
}

/**
 * Tipo para crear un nuevo plato (sin ID)
 */
export type NewDish = Omit<Dish, 'id'> & { id?: string };

/**
 * Props para el formulario de platos
 */
export interface DishFormProps {
  initialValues: Partial<Dish>;
  onSave: (dish: Partial<Dish>) => void;
  onCancel: () => void;
}

/**
 * Props para la tarjeta de plato
 */
export interface DishCardProps {
  item: Dish;
  onToggleActive: (dish: Dish) => void;
  onEdit?: (dish: Dish) => void;
}

/**
 * Interface para el componente manager de platos
 */
export interface DishManagerProps {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
  onToggleActive: (dish: Dish) => void;
  onEdit: (dish: Dish) => void;
  onNew: () => void;
}
