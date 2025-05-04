// Funciones utilitarias para listas filtrables
export type FilterType = 'all' | 'active' | 'inactive';

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
  if (filter === 'active') filtered = items.filter(i => i[activeField] !== false);
  if (filter === 'inactive') filtered = items.filter(i => i[activeField] === false);
  return showForm ? items.filter(i => i[activeField] !== false) : filtered;
}

// Exporta el tipo Filtro para usarlo en tus componentes
export type Filtro =
  | { tipo: "todos" }
  | { tipo: "estado"; valor: "activos" | "no-activos" }
  | { tipo: "categoria"; valor: string };
