// src/components/admin/AdminDashboard.tsx
import React, { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminGrid from "@/components/admin/AdminGrid";
import DishCard from "@/components/admin/DishCard";
import PromoCard from "@/components/admin/PromoCard";
import type { Filtro } from "@/lib/promoUtils";
import { useCrudList } from "@/hooks/useCrudList"; // Ajusta la ruta si es necesario

type Seccion = "dishes" | "promos";

const AdminDashboard: React.FC = () => {
    const [seccion, setSeccion] = useState<Seccion>("dishes");
    const [filtro, setFiltro] = useState<Filtro>({ tipo: "todos" });
    const [search, setSearch] = useState("");

    // Dishes
    const {
        items: dishes,
        loading: loadingDishes,
        error: errorDishes,
        handleToggleActive: handleToggleActiveDish,
        handleNew: handleNewDish,
    } = useCrudList({ table: "dishes", activeField: "available" });

    // Promos
    const {
        items: promos,
        loading: loadingPromos,
        error: errorPromos,
        handleToggleActive: handleToggleActivePromo,
        handleNew: handleNewPromo,
    } = useCrudList({ table: "promos", activeField: "active" });

    // Filtrado
    const itemsFiltrados = (seccion === "dishes" ? dishes : promos).filter((item) => {
        // Filtro por sidebar
        let matchFiltro = true;
        if (filtro.tipo === "estado") {
            matchFiltro = filtro.valor === "activos"
                ? item.available ?? item.active
                : !(item.available ?? item.active);
        } else if (filtro.tipo === "categoria") {
            matchFiltro = item.category === filtro.valor;
        }
        // Filtro por búsqueda
        const nombre = seccion === "dishes" ? item.name : item.title;
        const matchSearch = nombre.toLowerCase().includes(search.toLowerCase());
        return matchFiltro && matchSearch;
    });

    return (
        <div className="flex min-h-screen">
            <AdminNavbar
                seccion={seccion}
                setSeccion={setSeccion}
                filtro={filtro}
                setFiltro={setFiltro}
            />
            <main className="flex-1 p-6">
                <AdminHeader
                    search={search}
                    setSearch={setSearch}
                    onAdd={seccion === "dishes" ? handleNewDish : handleNewPromo}
                    label={seccion === "dishes" ? "Add dish" : "Add promo"}
                />
                <AdminGrid
                    items={itemsFiltrados}
                    loading={seccion === "dishes" ? loadingDishes : loadingPromos}
                    error={seccion === "dishes" ? errorDishes : errorPromos}
                    onToggleActive={seccion === "dishes" ? handleToggleActiveDish : handleToggleActivePromo}
                    CardComponent={seccion === "dishes" ? DishCard : PromoCard}
                />
            </main>
        </div>
    );
};

export default AdminDashboard;