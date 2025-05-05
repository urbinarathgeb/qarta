/**
 * Formatea un número como precio en pesos chilenos
 * @param price Número a formatear
 * @returns String formateado como moneda chilena
 */
export function formatPriceCLP(price?: number | null): string {
  if (typeof price !== 'number' || isNaN(price)) return '-';
  return '$' + price.toLocaleString('es-CL');
}
