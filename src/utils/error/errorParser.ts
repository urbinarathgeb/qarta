import type { AppError } from './types';

/**
 * Convierte cualquier tipo de error a un formato estandarizado
 */
export function parseError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message || 'Error desconocido',
      details: error.stack,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (typeof error === 'object' && error !== null) {
    // Para errores de Supabase y otros servicios
    const errorObj = error as Record<string, unknown>;
    return {
      code: errorObj.code as string,
      message: (errorObj.message || errorObj.error || 'Error desconocido') as string,
      details: errorObj,
    };
  }

  return { message: 'Error desconocido' };
}
