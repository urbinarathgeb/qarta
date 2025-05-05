import React from 'react';

const PromoCard = ({ item: promo, onToggleActive }) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col shadow relative">
    <div className="font-bold text-lg text-white">{promo.title}</div>
    <div className="text-sm text-gray-400 mb-2">{promo.type}</div>
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${
        promo.active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
      }`}
    >
      {promo.active ? 'Active' : 'Inactive'}
    </span>
    <div className="bg-gray-900 text-white rounded p-2 text-center mb-2">
      <div className="text-xs text-gray-400">Price</div>
      <div className="font-bold text-lg">
        {promo.price
          ? `$${promo.price.toLocaleString('es-CL', { minimumFractionDigits: 2 })}`
          : '-'}
      </div>
    </div>
    <div className="flex items-center justify-between mt-auto">
      <span className="text-xs text-gray-400">Status</span>
      <span className="font-bold text-white">{promo.active ? 'Active' : 'Inactive'}</span>
      <input
        type="checkbox"
        checked={promo.active}
        onChange={() => onToggleActive(promo)}
        className="ml-2"
      />
    </div>
    <button className="absolute top-2 right-2 text-gray-400 hover:text-white">⋯</button>
  </div>
);

export default PromoCard;
