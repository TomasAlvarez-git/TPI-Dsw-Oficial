import { useState } from 'react';

export const usePagination = (initialPage = 1, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  // Función para cambiar página asegurando que sea número
  const handlePageChange = (newPage) => {
    setPage(Number(newPage));
  };

  // Función para cambiar tamaño, reseteando a la página 1 (Regla de UX)
  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setPage(1);
  };

  const resetPage = () => setPage(1);

  return {
    page,
    pageSize,
    changePage: handlePageChange,
    changePageSize: handlePageSizeChange,
    resetPage,
  };
};