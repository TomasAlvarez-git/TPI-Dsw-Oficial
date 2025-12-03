import { instance } from '../../shared/api/axiosInstance';

export const getPublicProducts = async () => {
  try {
    const response = await instance.get('api/products');

    // El backend devuelve un ARRAY directo
    const list = Array.isArray(response.data) ? response.data : [];

    return {
      data: list,
      error: null,
    };

  } catch (error) {
    console.error('Error cargando productos públicos:', error);

    return {
      data: [],
      error,
    };
  }
};

export const getAuthProducts = async (searchTerm = '', status = 'all', page = 1, pageSize = 10) => {
  try {
    const params = new URLSearchParams();

    params.append('PageNumber', page);
    params.append('PageSize', pageSize);

    if (searchTerm) params.append('Search', searchTerm);

    if (status && status !== 'all') params.append('Status', status);

    // Asegúrate de que 'instance' esté importado correctamente de tu configuración de axios
    // const response = await instance.get(...)
    // Asumo que 'instance' ya lo tienes definido arriba en tu archivo original.

    // NOTA: Si no tienes 'instance' definido en este archivo, usa axios directamente o tu instancia importada
    const response = await instance.get(`/api/products/admin?${params.toString()}`);

    console.log('Datos recibidos del Back:', response.data);

    let rawList = [];
    let totalCount = 0;

    // Lógica para extraer la lista y el total
    if (response.data && Array.isArray(response.data.productItems)) {
      rawList = response.data.productItems;
      totalCount = response.data.total || 0;
    } else if (Array.isArray(response.data)) {
      rawList = response.data;
      totalCount = response.data.length;
    } else if (response.data && Array.isArray(response.data.items)) {
      rawList = response.data.items;
      totalCount = response.data.totalCount || 0;
    }

    // === NORMALIZACIÓN CORREGIDA ===
    const normalizedList = rawList.map(item => ({
      // IDs
      id: item.id || item.Id,
      sku: item.sku || item.Sku,

      // Textos
      name: item.name || item.Name,
      description: item.description || item.Description,

      // === ¡AQUÍ ESTABAN LOS FALTANTES! ===
      // 1. Agregamos el internalCode explícitamente
      internalCode: item.internalCode || item.InternalCode || null,

      // 2. Unificamos el precio a 'currentPrice' (como viene del back)
      currentPrice: item.currentPrice || item.CurrentPrice || item.currentUnitPrice || item.Price || 0,

      // Valores numéricos
      stockQuantity: item.stockQuantity || item.StockQuantity || item.Stock || 0,

      // Booleano
      isActive: item.isActive !== undefined ? item.isActive : (item.IsActive !== undefined ? item.IsActive : false),
    }));

    return {
      data: normalizedList,
      total: totalCount,
      error: null,
    };

  } catch (error) {
    console.error('Error cargando productos:', error);

    return {
      data: [],
      total: 0,
      error,
    };
  }
};