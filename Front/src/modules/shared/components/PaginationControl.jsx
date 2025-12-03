import React from 'react';

export const PaginationControl = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  // Si solo hay 1 página y no quieres mostrar nada, descomenta la siguiente línea:
  // if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center items-center mt-6 gap-4 text-sm text-gray-700 font-medium pb-10">

      {/* PREVIOUS */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Anterior
      </button>

      {/* NÚMEROS */}
      <div className="flex items-center gap-2">

        {/* Página actual (Cuadradito negro) */}
        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white font-bold">
          {currentPage}
        </span>

        {/* Página siguiente (Si existe) */}
        {currentPage < totalPages && (
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}

        {/* Puntos suspensivos "..." */}
        {currentPage + 1 < totalPages && (
          <span className="px-1">...</span>
        )}

        {/* Última página */}
        {currentPage + 2 < totalPages && (
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        )}
      </div>

      {/* NEXT */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Siguiente →
      </button>

      {/* SEPARADOR VERTICAL */}
      <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>

      {/* SELECT: cantidad por página */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs hidden sm:inline">Filas:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-2 py-1 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

    </div>
  );
};