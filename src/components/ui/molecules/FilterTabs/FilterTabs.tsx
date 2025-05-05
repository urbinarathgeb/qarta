import React from "react";
import { Button } from "@/components/ui";
import { clsx } from "clsx";

export type FilterOption = {
    value: string;
    label: string;
    colorClass?: string;
};

export interface FilterTabsProps {
    /**
     * Opciones de filtrado disponibles
     */
    options: FilterOption[];

    /**
     * Valor actualmente seleccionado
     */
    value: string;

    /**
     * Función llamada cuando se cambia la selección
     */
    onChange: (value: string) => void;

    /**
     * Clases adicionales para el contenedor
     */
    className?: string;
}

/**
 * Componente para mostrar pestañas de filtro que permite al usuario
 * alternar entre diferentes vistas o conjuntos de datos.
 */
const FilterTabs: React.FC<FilterTabsProps> = ({
    options,
    value,
    onChange,
    className = "",
}) => {
    if (!options || options.length === 0) return null;

    return (
        <div
            className={clsx(
                "mb-4 flex flex-wrap gap-2 justify-center",
                className
            )}
        >
            {options.map((option) => (
                <Button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    variant={value === option.value ? "primary" : "outline"}
                    size="sm"
                    className={value === option.value && option.colorClass ? option.colorClass : ""}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
};

export default FilterTabs; 