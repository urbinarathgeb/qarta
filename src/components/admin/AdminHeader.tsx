import React from 'react';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onAdd: () => void;
  label: string;
  placeholder?: string;
}

const AdminHeader: React.FC<Props> = ({ search, setSearch, onAdd, label, placeholder }) => (
  <div className="flex items-center justify-between mb-6 gap-4">
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        placeholder={placeholder || 'Buscar...'}
        className="bg-gray-900 text-white px-4 py-2 rounded w-full pr-10"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
          aria-label="Limpiar búsqueda"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded font-bold whitespace-nowrap"
      onClick={onAdd}
    >
      + {label}
    </button>
  </div>
);

export default AdminHeader;
