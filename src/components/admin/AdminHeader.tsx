import React from 'react';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onAdd: () => void;
  label: string;
}

const AdminHeader: React.FC<Props> = ({ search, setSearch, onAdd, label }) => (
  <div className="flex items-center justify-between mb-6">
    <input
      type="text"
      placeholder="Search..."
      className="bg-gray-900 text-white px-4 py-2 rounded w-1/3"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold" onClick={onAdd}>
      + {label}
    </button>
  </div>
);

export default AdminHeader;
