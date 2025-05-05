import React from 'react';
import { formatErrorMessage } from '@/utils/error';

export interface ErrorMessageProps {
    error: unknown;
    className?: string;
}

/**
 * Componente para mostrar mensajes de error de forma consistente
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
    error,
    className = ''
}) => {
    if (!error) return null;

    const errorMessage = formatErrorMessage(error);

    return (
        <div
            className={`p-3 mb-4 border border-red-300 bg-red-50 text-red-600 rounded-md ${className}`}
            role="alert"
            aria-live="polite"
        >
            <p className="text-sm font-medium">{errorMessage}</p>
        </div>
    );
};

export default ErrorMessage; 