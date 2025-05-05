import React, { useState } from 'react';
import clsx from 'clsx';
import type { Filtro } from '@/lib/promoUtils';

type Seccion = 'dishes' | 'promos';

interface Props {
  seccion: Seccion;
  setSeccion: (s: Seccion) => void;
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
}

const AdminNavbar: React.FC<Props> = ({ seccion, setSeccion, filtro, setFiltro }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {!collapsed && <h1 className="text-lg">Panel</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-white">
          <span>☰</span>
        </button>
      </div>
      <nav className="flex flex-col mt-4 gap-2">
        <h2 className="px-4 text-xs text-gray-400 uppercase">Menú</h2>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'dishes' && filtro.tipo === 'todos' && 'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('dishes');
            setFiltro({ tipo: 'todos' });
          }}
        >
          Todos los platos
        </button>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'dishes' &&
              filtro.tipo === 'estado' &&
              filtro.valor === 'activos' &&
              'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('dishes');
            setFiltro({ tipo: 'estado', valor: 'activos' });
          }}
        >
          Activos
        </button>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'dishes' &&
              filtro.tipo === 'estado' &&
              filtro.valor === 'no-activos' &&
              'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('dishes');
            setFiltro({ tipo: 'estado', valor: 'no-activos' });
          }}
        >
          No Activos
        </button>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'dishes' &&
              filtro.tipo === 'categoria' &&
              filtro.valor === 'pizza' &&
              'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('dishes');
            setFiltro({ tipo: 'categoria', valor: 'pizza' });
          }}
        >
          Pizzas
        </button>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'dishes' &&
              filtro.tipo === 'categoria' &&
              filtro.valor === 'bebida' &&
              'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('dishes');
            setFiltro({ tipo: 'categoria', valor: 'bebida' });
          }}
        >
          Bebidas
        </button>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'dishes' &&
              filtro.tipo === 'categoria' &&
              filtro.valor === 'cerveza' &&
              'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('dishes');
            setFiltro({ tipo: 'categoria', valor: 'cerveza' });
          }}
        >
          Cervezas
        </button>
        <h2 className="px-4 text-xs text-gray-400 uppercase mt-4">Promos</h2>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'promos' && filtro.tipo === 'todos' && 'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('promos');
            setFiltro({ tipo: 'todos' });
          }}
        >
          Todas las promos
        </button>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'promos' &&
              filtro.tipo === 'estado' &&
              filtro.valor === 'activos' &&
              'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('promos');
            setFiltro({ tipo: 'estado', valor: 'activos' });
          }}
        >
          Activas
        </button>
        <button
          className={clsx(
            'px-4 py-2 text-left',
            seccion === 'promos' &&
              filtro.tipo === 'estado' &&
              filtro.valor === 'no-activos' &&
              'bg-gray-700'
          )}
          onClick={() => {
            setSeccion('promos');
            setFiltro({ tipo: 'estado', valor: 'no-activos' });
          }}
        >
          No activas
        </button>
      </nav>
    </aside>
  );
};

export default AdminNavbar;
