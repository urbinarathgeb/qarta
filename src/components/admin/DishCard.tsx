import React from "react";

interface DishCardProps {
    item: any; // O el tipo específico de tu dish si lo tienes
    onToggleActive: (dish: any) => void;
}

const DishCard: React.FC<DishCardProps> = ({ item: dish, onToggleActive }) => (
    <div className="bg-gray-light rounded-lg p-4 flex flex-col shadow relative gap-2">

        <div >
            <h2 className="font-bold text-lg text-text">{dish.name}</h2>
            <p className="text-sm text-gray-400">Categoría: {dish.category}</p>
        </div>

        <div className="flex items-center justify-between">
            <p className="text-text text-sm">Estado:</p>
            <span
                className={`inline-block w-20 py-2 rounded-full text-text text-center text-xs font-bold ${dish.available ? "bg-green" : "bg-red "
                    }`}
            >
                {dish.available ? "Activo" : "Inactivo"}
            </span>
        </div>
        <div className="border-b-3 border-text-light text-text rounded flex items-center justify-between">
            <div className="text-sm text-text">Precio</div>
            <div className="font-semibold text-lg">
                ${dish.price?.toLocaleString("es-CL")}
            </div>
        </div>
        {/* <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-gray-400">Status</span>
            <span className="font-bold text-white">{dish.available ? "Active" : "Inactive"}</span>
            <input
                type="checkbox"
                checked={dish.available}
                onChange={() => onToggleActive(dish)}
                className="ml-2"
            />
        </div> */}
        <button className="absolute top-2 right-2 text-gray-400 hover:text-white">⋯</button>
    </div>
);

export default DishCard;
