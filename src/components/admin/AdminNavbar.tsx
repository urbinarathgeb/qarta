import React, { useState } from "react";
import { Home, Settings, Menu } from "lucide-react";
import clsx from "clsx";

// Subcomponente para cada ítem del sidebar
type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  collapsed,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-700 cursor-pointer">
      <span className="text-xl">{icon}</span>
      {!collapsed && (
        <span className="whitespace-nowrap">{label}</span>
      )}
    </div>
  );
};

// Datos del menú
const sidebarSections = [
  {
    title: "Menú",
    items: [
      { label: "Activas", icon: <Home size={20} /> },
      { label: "No Activas", icon: <Home size={20} /> },
      {
        label: "Todos los platos",
        icon: <Home size={20} />,
      },
    ],
  },
  {
    title: "Promociones",
    items: [
      {
        label: "Todas las promos",
        icon: <Settings size={20} />,
      },
      { label: "Activas", icon: <Settings size={20} /> },
      { label: "No activas", icon: <Settings size={20} /> },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {!collapsed && <h1 className="text-lg">Panel</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex flex-col mt-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <h2 className="px-4 text-sm text-gray-400 uppercase tracking-wider mb-1">
                {section.title}
              </h2>
            )}
            {section.items.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
              />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
