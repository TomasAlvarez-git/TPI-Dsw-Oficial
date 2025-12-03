// Servicio para filtrar productos según texto de búsqueda
export function filterProductsBySearch(products, searchText) {
  const text = searchText?.toLowerCase() || '';

  return products.filter(p =>
    p.name.toLowerCase().includes(text),
  );
}

// Servicio para obtener el parámetro "search" desde searchParams
export function getSearchParam(searchParams) {
  return searchParams.get('search')?.toLowerCase() || '';
}
