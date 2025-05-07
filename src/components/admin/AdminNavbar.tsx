import React, { useState } from 'react';
import clsx from 'clsx';
import type { Filtro } from '@/lib/promoUtils';
import { Button } from '@/components/ui';

type Seccion = 'dishes' | 'promos';

interface Props {
  seccion: Seccion;
  setSeccion: (s: Seccion) => void;
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
}

interface NavItem {
  label: string;
  seccion: Seccion;
  filtro: Filtro;
  heading?: string; // Para agrupar elementos bajo un encabezado
}

// Definiciones constantes para agrupar y organizar
const MENU_SECTION: Seccion = 'dishes';
const PROMOS_SECTION: Seccion = 'promos';

const AdminNavbar: React.FC<Props> = ({ seccion, setSeccion, filtro, setFiltro }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Definición más concisa de los ítems del menú usando una generación más funcional
  const navItems: NavItem[] = [
    // Sección de Menú
    { heading: 'Menú', label: '', seccion: MENU_SECTION, filtro: { tipo: 'todos' } as Filtro },
    { label: 'Todos los platos', seccion: MENU_SECTION, filtro: { tipo: 'todos' } as Filtro },

    // Items de estado para menú
    {
      label: 'Activos',
      seccion: MENU_SECTION,
      filtro: { tipo: 'estado', valor: 'activos' } as Filtro,
    },
    {
      label: 'No Activos',
      seccion: MENU_SECTION,
      filtro: { tipo: 'estado', valor: 'no-activos' } as Filtro,
    },

    // Items de categoría para menú
    {
      label: 'Pizzas',
      seccion: MENU_SECTION,
      filtro: { tipo: 'categoria', valor: 'pizza' } as Filtro,
    },
    {
      label: 'Bebidas',
      seccion: MENU_SECTION,
      filtro: { tipo: 'categoria', valor: 'bebida' } as Filtro,
    },
    {
      label: 'Cervezas',
      seccion: MENU_SECTION,
      filtro: { tipo: 'categoria', valor: 'cerveza' } as Filtro,
    },

    // Sección de Promos
    { heading: 'Promos', label: '', seccion: PROMOS_SECTION, filtro: { tipo: 'todos' } as Filtro },
    { label: 'Todas las promos', seccion: PROMOS_SECTION, filtro: { tipo: 'todos' } as Filtro },

    // Items de estado para promos
    {
      label: 'Activas',
      seccion: PROMOS_SECTION,
      filtro: { tipo: 'estado', valor: 'activos' } as Filtro,
    },
    {
      label: 'No activas',
      seccion: PROMOS_SECTION,
      filtro: { tipo: 'estado', valor: 'no-activos' } as Filtro,
    },
  ];

  // Función para verificar si un item está activo - versión concisa
  const isActive = ({ seccion: itemSeccion, filtro: itemFiltro }: NavItem): boolean => {
    if (itemSeccion !== seccion) return false;
    if (itemFiltro.tipo !== filtro.tipo) return false;
    if (itemFiltro.tipo === 'todos') return true;

    return itemFiltro.valor === filtro.valor;
  };

  return (
    <aside
      className={clsx(
        'bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {!collapsed && <h1 className="text-lg">Panel</h1>}
        <Button
          variant="ghost"
          onClick={() => setCollapsed((prev) => !prev)}
          className="ml-auto text-white"
        >
          <span>☰</span>
        </Button>
      </div>
      <nav className="flex flex-col gap-2 mt-4">
        {navItems.map((item, index) =>
          item.heading ? (
            <h2 key={`heading-${index}`} className="px-4 mt-2 text-xs text-gray-400 uppercase">
              {item.heading}
            </h2>
          ) : (
            <Button
              key={`nav-item-${index}`}
              variant="ghost"
              className={clsx(
                'px-4 py-2 text-left justify-start rounded-none h-auto',
                isActive(item) && 'bg-gray-700'
              )}
              onClick={() => {
                setSeccion(item.seccion);
                setFiltro(item.filtro);
              }}
            >
              {item.label}
            </Button>
          )
        )}
      </nav>
    </aside>
  );
};

export default AdminNavbar;
