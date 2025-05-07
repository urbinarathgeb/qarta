// Funciones utilitarias para listas filtrables

/**
 * Tipo para representar los estados de filtro básicos
 */
export type FilterType = 'all' | 'active' | 'inactive';

/**
 * Estados válidos para los filtros de estado
 */
export type EstadoValor = 'activos' | 'no-activos';

/**
 * Categorías válidas para filtros
 */
export type CategoriaValor = 'pizza' | 'bebida' | 'cerveza' | 'postre' | 'pasta' | string;

/**
 * Tipos de filtros disponibles para el navbar y componentes filtrados
 */
export type FiltroTipo = 'todos' | 'estado' | 'categoria';

/**
 * Filtro completo utilizado en los componentes
 * Definido de manera más flexible para evitar problemas de tipado estricto
 */
export interface Filtro {
  tipo: FiltroTipo;
  valor?: EstadoValor | CategoriaValor;
}

/**
 * Filtra una lista de items por un campo booleano ('active', 'available', etc.) y filtro visual.
 * @param items Lista de elementos a filtrar
 * @param filter Filtro visual ('all', 'active', 'inactive')
 * @param showForm Si está activo el formulario (opcional)
 * @param activeField Nombre del campo booleano ('active', 'available', etc.)
 */
export function filtrarPorEstado<T extends Record<string, any>>(
  items: T[],
  filter: FilterType,
  showForm?: boolean,
  activeField: string = 'active'
): T[] {
  let filtered = items;
  if (filter === 'active') filtered = items.filter((i) => i[activeField] !== false);
  if (filter === 'inactive') filtered = items.filter((i) => i[activeField] === false);
  return showForm ? items.filter((i) => i[activeField] !== false) : filtered;
}
