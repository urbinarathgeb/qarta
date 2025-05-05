import React from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  required?: boolean;
  tip?: string;
  children: React.ReactNode;
}

/**
 * Componente para agrupar campos de formulario con un estilo consistente
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  className = '',
  required = false,
  tip,
  children,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {tip && <p className="mt-1 text-xs text-gray-500">{tip}</p>}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
