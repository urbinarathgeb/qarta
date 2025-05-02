import React from "react";

interface StatusFilterProps {
  value: "all" | "active" | "inactive";
  onChange: (val: "all" | "active" | "inactive") => void;
  labels?: {
    all?: string;
    active?: string;
    inactive?: string;
  };
  className?: string;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  value,
  onChange,
  labels = {},
  className = "",
}) => {
  return (
    <div
      className={`mb-4 flex gap-2 justify-center ${className}`}
    >
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1 rounded ${
          value === "all"
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {labels.all || "Todos"}
      </button>
      <button
        onClick={() => onChange("active")}
        className={`px-3 py-1 rounded ${
          value === "active"
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {labels.active || "Solo activos"}
      </button>
      <button
        onClick={() => onChange("inactive")}
        className={`px-3 py-1 rounded ${
          value === "inactive"
            ? "bg-gray-400 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {labels.inactive || "Solo inactivos"}
      </button>
    </div>
  );
};

export default StatusFilter;
