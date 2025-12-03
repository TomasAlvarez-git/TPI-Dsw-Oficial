const productErrorMessage = {
  // Creación
  3000: 'No pudimos crear el producto',
  3001: 'Faltan datos obligatorios',
  3002: 'El nombre del producto es inválido',
  3003: 'El precio del producto no es válido',
  3004: 'Ya existe un producto con ese nombre',
  3005: 'La categoría seleccionada no existe',
  3006: 'No se pudo cargar la imagen del producto',

  // Actualización
  3100: 'No pudimos actualizar el producto',
  3101: 'No tienes permisos para modificar este producto',
  3102: 'El producto no existe',
  3103: 'El precio ingresado no es válido',
  3104: 'La categoría seleccionada no es válida',
  3105: 'No se pudo actualizar la imagen del producto',
  3106: 'No puedes editar un producto que está inactivo',

  // Stock
  3200: 'No se pudo actualizar el stock',
  3201: 'El stock no puede ser negativo',
  3202: 'La cantidad ingresada es inválida',
  3203: 'El producto está sin stock',
  3204: 'No se pudo obtener el stock del producto',

  // Visibilidad
  3300: 'No se pudo cambiar el estado del producto',
  3301: 'El producto ya está inactivo',
  3302: 'El producto ya está activo',
  3303: 'No puedes mostrar un producto sin stock',
  3304: 'No puedes ocultar un producto que está en una orden activa',

  // Categorías
  3400: 'No pudimos crear la categoría',
  3401: 'Ya existe una categoría con ese nombre',
  3402: 'La categoría no existe',
  3403: 'No se puede eliminar una categoría con productos activos',
  3404: 'No pudimos actualizar la categoría',

  // Eliminación
  3500: 'No se pudo eliminar el producto',
  3501: 'No puedes eliminar un producto en uso en una orden',
  3502: 'El producto ya está eliminado o inactivo',

  // Consultas
  3600: 'No encontramos el producto solicitado',
  3601: 'No se pudieron obtener los productos',
  3602: 'No se encontraron productos con esos filtros',
  3603: 'No tienes permisos para ver este producto',

};

export {
  productErrorMessage,
};