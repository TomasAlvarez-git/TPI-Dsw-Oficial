const orderErrorMessage = {
  // Creación
  2000: 'No pudimos crear la orden. Intenta nuevamente',
  2001: 'Faltan datos obligatorios para crear la orden',
  2002: 'La dirección de envío es inválida',
  2003: 'Algunos productos ya no están disponibles',
  2004: 'Uno de los productos cambió de precio',
  2005: 'No pudimos calcular el costo total',

  // Stock
  2100: 'Uno de los productos ya no está disponible',
  2101: 'No hay stock suficiente',
  2102: 'El producto no puede ser enviado a tu ubicación',
  2103: 'Uno de los productos ya no existe',

  // Pago
  2200: 'No pudimos procesar el pago',
  2201: 'El método de pago es inválido',
  2202: 'La tarjeta fue rechazada',
  2203: 'Saldo insuficiente',
  2204: 'Error al comunicarse con el proveedor de pago',
  2205: 'No se completó el pago, intenta nuevamente',
  2206: 'Ya existe un pago asociado a esta orden',

  // Envío
  2300: 'No pudimos generar el envío',
  2301: 'El transportista no está disponible',
  2302: 'No pudimos obtener información del envío',
  2303: 'La orden ya fue enviada',
  2304: 'No se puede cancelar una orden que ya fue enviada',

  // Modificación
  2400: 'No puedes modificar esta orden',
  2401: 'La orden ya fue pagada',
  2402: 'La orden ya está completada',
  2403: 'No se pudo actualizar la orden',
  2404: 'No puedes cambiar un producto de una orden ya paga',

  // Cancelación
  2500: 'No se pudo cancelar la orden',
  2501: 'Solo puedes cancelar una orden pendiente',
  2502: 'La orden ya fue enviada, no puede ser cancelada',
  2503: 'La orden ya está cancelada',

  // Consultas
  2600: 'No encontramos la orden solicitada',
  2601: 'No tienes permiso para ver esta orden',
  2602: 'No pudimos obtener las órdenes',
  2603: 'No se encontraron órdenes para los filtros aplicados',

  // Integraciones
  2700: 'Error al conectarse con el sistema de envíos',
  2701: 'Error al conectar con el servicio de pagos',
  2702: 'No pudimos confirmar el estado de la orden',

  // Internos
  2800: 'Ocurrió un error inesperado procesando la orden',
  2801: 'No se pudo guardar la orden',
  2802: 'No se pudo actualizar el estado de la orden',
};

export {
  orderErrorMessage,
};