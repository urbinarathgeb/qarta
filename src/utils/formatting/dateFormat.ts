/**
 * Formatea una fecha como string en formato local
 * @param dateStr String de fecha a formatear
 * @returns String con fecha formateada
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-CL');
}
