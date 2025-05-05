import React, { useEffect } from "react";
import { formatPriceCLP } from "@/utils/formatting";
import { useCrudList } from "@/hooks/useCrudList";
import { filtrarPorEstado } from "@/lib/promoUtils";
import type { Dish } from "@/types/dish";
import type { FilterType } from "@/types/common";
import { logError } from "@/utils/error";
import { Button, ErrorMessage, FilterTabs } from "@/components/ui";
import { EntityCardGrid, type EntityCardField } from "@/components/ui/organisms";
import DishForm from "./DishForm";

interface DishManagerProps {
    filtro: {
        tipo: string;
        valor: string;
    };
}

/**
 * Componente para gestionar platos en el panel admin
 */
const DishManager: React.FC<DishManagerProps> = ({ filtro }) => {
    const {
        items: dishes,
        loading,
        error,
        showForm,
        editingItem,
        filter,
        setFilter,
        handleNew,
        handleEdit,
        handleCancelForm,
        handleSave,
        handleToggleActive,
    } = useCrudList<Dish>({
        table: "dishes",
        defaultFilter: "all",
        activeField: "available",
    });

    // Utiliza el manejador de errores mejorado
    useEffect(() => {
        if (error) {
            logError(error, 'DishManager');
        }
    }, [error]);

    // Aplica el filtro recibido
    const dishesFiltrados = dishes.filter((dish) => {
        if (filtro.tipo === "todos") return true;
        if (filtro.tipo === "estado") {
            return filtro.valor === "activos" ? dish.available : !dish.available;
        }
        if (filtro.tipo === "categoria") {
            return dish.category === filtro.valor;
        }
        return true;
    });

    // Definición de campos para la card
    const dishFields: EntityCardField<Dish>[] = [
        { key: "name", label: "Nombre", accessor: "name" },
        { key: "description", label: "Descripción", accessor: "description" },
        {
            key: "price",
            label: "Precio",
            accessor: "price",
            formatter: (value) => formatPriceCLP(value as number),
        },
        { key: "category", label: "Categoría", accessor: "category" },
        {
            key: "available",
            label: "Disponible",
            accessor: "available",
            formatter: (value) =>
                value ? (
                    <span className="text-green-600">Sí</span>
                ) : (
                    <span className="text-gray-400">No</span>
                ),
        },
    ];

    // Opciones de filtro para FilterTabs
    const filterOptions = [
        { value: "all", label: "Todos" },
        { value: "active", label: "Solo activos", colorClass: "bg-green-600" },
        { value: "inactive", label: "Solo inactivos", colorClass: "bg-gray-400" }
    ];

    return (
        <main className="min-h-screen bg-background font-serif py-8 w-full">
            {error && <ErrorMessage error={error} className="mb-4 mx-auto max-w-2xl" />}

            {!showForm && (
                <FilterTabs
                    options={filterOptions}
                    value={filter}
                    onChange={(value) => setFilter(value as FilterType)}
                />
            )}

            {showForm ? (
                <DishForm
                    initialValues={editingItem || {}}
                    onSave={handleSave}
                    onCancel={handleCancelForm}
                />
            ) : (
                <>
                    <div className="mb-8 flex justify-end">
                        <Button
                            onClick={handleNew}
                            leftIcon={<span>+</span>}
                        >
                            Nuevo Plato
                        </Button>
                    </div>
                    <div className="w-full max-w-screen-2xl mx-auto px-4">
                        <EntityCardGrid
                            items={dishesFiltrados}
                            fields={dishFields}
                            loading={loading}
                            onEdit={handleEdit}
                            onToggleActive={handleToggleActive}
                            emptyMessage="No hay platos registrados."
                        />
                    </div>
                </>
            )}
        </main>
    );
};

export default DishManager; 