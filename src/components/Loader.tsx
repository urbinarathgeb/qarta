import React from "react";

const Loader: React.FC<{ message?: string; className?: string }> = ({ message = "Cargando...", className = "" }) => (
  <div className={`flex justify-center items-center py-8 text-muted ${className}`}>
    <svg className="animate-spin h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    <span>{message}</span>
  </div>
);

export default Loader;
