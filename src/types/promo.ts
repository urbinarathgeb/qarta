/**
 * Tipos de promociones disponibles
 */
export enum PromoType {
  DESCUENTO = 'descuento',
  ESPECIAL = 'especial',
  OFERTA = 'oferta',
}

/**
 * Interface que representa una promoción
 */
export interface Promo {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: number;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  type: string | PromoType; // Permitimos string para compatibilidad con la BD
  dish_id?: string;
  options?: string[];
  created_at?: string;
}

/**
 * Tipo para crear una nueva promoción (sin ID)
 */
export type NewPromo = Omit<Promo, 'id'> & { id?: string };

/**
 * Props para el formulario de promociones
 */
export interface PromoFormProps {
  initialValues: Partial<Promo>;
  onSave: (promo: Partial<Promo>) => void;
  onCancel: () => void;
}

/**
 * Props para la tarjeta de promoción
 */
export interface PromoCardProps {
  item: Promo;
  onToggleActive: (promo: Promo) => void;
  onEdit?: (promo: Promo) => void;
}

/**
 * Interface para el componente manager de promociones
 */
export interface PromoManagerProps {
  promos: Promo[];
  loading: boolean;
  error: string | null;
  onToggleActive: (promo: Promo) => void;
  onEdit: (promo: Promo) => void;
  onNew: () => void;
}
