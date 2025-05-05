/**
 * Formatea un booleano como texto
 * @param value Valor booleano a formatear
 * @param yes Texto a mostrar para true
 * @param no Texto a mostrar para false
 * @returns String formateado
 */
export function formatBool(value?: boolean | null, yes: string = "Sí", no: string = "No"): string {
    return value ? yes : no;
} 