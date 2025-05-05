/**
 * Interface para errores de la aplicación
 */
export interface AppError {
    code?: string;
    message: string;
    details?: unknown;
} 