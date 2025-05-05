import { parseError } from './errorParser';

/**
 * Formatea mensajes de error para el usuario final
 */
export function formatErrorMessage(error: unknown): string {
  const parsedError = parseError(error);

  // Mensajes amigables para códigos de error conocidos
  if (parsedError.code) {
    switch (parsedError.code) {
      case '23505':
        return 'Ya existe un elemento con esa información';
      case 'PGRST116':
        return 'No tienes permisos para realizar esta acción';
      case 'auth/invalid-login-credentials':
        return 'Credenciales inválidas. Inténtalo de nuevo';
      default:
        // Si no reconocemos el código, mostramos el mensaje general
        break;
    }
  }

  return parsedError.message || 'Ocurrió un error inesperado';
}
