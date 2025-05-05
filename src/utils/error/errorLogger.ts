import { parseError } from './errorParser';

/**
 * Registra errores en consola con formato mejorado
 */
export function logError(error: unknown, context: string = 'Error general'): void {
  // En desarrollo mostramos detalles completos
  if (import.meta.env.DEV) {
    console.group(`🔴 Error en: ${context}`);
    console.error(error);
    console.groupEnd();
  } else {
    // En producción solo información básica para no exponer detalles sensibles
    const errorInfo = parseError(error);
    console.error(`Error (${context}): ${errorInfo.message}`);
  }
}
