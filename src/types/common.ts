import React from 'react';

/**
 * Tipo para filtros de estado
 */
export type FilterType = 'all' | 'active' | 'inactive';

/**
 * Interface para opciones del hook useCrudList
 */
export interface UseCrudListOptions<T> {
    table: string;
    defaultFilter?: FilterType;
    mapItem?: (item: any) => T;
    defaultItem?: Partial<T>;
    activeField?: string; // 'active', 'available', etc.
}

/**
 * Interface para props de componentes de tarjetas CRUD
 */
export interface CrudCardProps<T> {
    item: T;
    onEdit: (item: T) => void;
    onToggleActive: (item: T) => void;
    activeField?: string;
}

/**
 * Interface para campos de tarjetas CRUD
 */
export type CrudCardField<T = any> = {
    key: string;
    label: string;
    formatter?: (value: any) => string | React.ReactNode;
    accessor?: keyof T;
}