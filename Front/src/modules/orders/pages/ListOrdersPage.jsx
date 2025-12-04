import { useEffect, useState, useCallback } from 'react';
import Card from '../../shared/components/Card';
import { listOrders } from '../services/listServices';
import { orderStatus } from '../services/orderStatus';
import { orderErrorMessage } from '../helpers/backendError';

function ListOrdersPage() {
  // ----------------------------------
  // Estados
  // ----------------------------------
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10); // CAMBIO: Agregado setPageSize
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [expandedId, setExpandedId] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  // ----------------------------------
  //  Expandir detalle
  // ----------------------------------
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ----------------------------------
  //  Fetch de órdenes (con filtros)
  // ----------------------------------
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const normalizedSearch = searchTerm?.toLowerCase() || '';
      const { data, error } = await listOrders(pageNumber, pageSize);

      if (error) throw error;

      let items = data?.orderItems ?? [];

      // === FILTRO: ESTADO ===
      if (status !== orderStatus.ALL) {
        items = items.filter((o) => o.status === status);
      }

      // === FILTRO: BÚSQUEDA ===
      if (normalizedSearch.trim() !== '') {
        items = items.filter(
          (order) =>
            (order.customerName ?? '')
              .toLowerCase()
              .includes(normalizedSearch) ||
            order.id?.toLowerCase().includes(normalizedSearch),
        );
      }

      setOrders(items);
      setTotal(data?.total ?? items.length);
    } catch (error) {
      // ------------------------------
      //  MANEJO DE ERRORES UNIFICADO
      // ------------------------------
      if (error?.response?.data) {
        const backend = error.response.data;
        const code = backend.errorCode;
        const devMessage = backend.message;

        const friendly =
          orderErrorMessage[code] ||
          'No se pudieron cargar las órdenes en este momento.';

        setErrorMessage(friendly);

        console.warn(`OrderError ${code}: ${devMessage}`);
      } else {
        setErrorMessage('No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm, status]);

  // ----------------------------------
  //  Ejecutar fetch al montar y al cambiar filtros
  // ----------------------------------
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  // ----------------------------------
  //  Ejecutar búsqueda
  // ----------------------------------
  const handleSearch = async () => {
    setPageNumber(1);
    await fetchOrders();
  };

  // ----------------------------------
  //  Render
  // ----------------------------------
  return (
    <div>
      <Card>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Órdenes</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-2 mt-4">
          {/* BUSCADOR */}
          <div className="flex items-center gap-2 flex-1">
            <input
              value={searchTerm}
              onChange={(evt) => {
                setSearchTerm(evt.target.value);
                setPageNumber(1);
              }}
              type="text"
              placeholder='Buscar por ID o Nombre'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 ...'
            />
            <button
              className="h-10 w-10 flex items-center justify-center bg-purple-100 rounded-lg"
              onClick={handleSearch}
            >
              <svg
                className="w-5 h-5 text-purple-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </div>

          {/* SELECT ESTADO */}
          <select
            value={status}
            onChange={(evt) => {
              setStatus(evt.target.value);
              setPageNumber(1);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
          >
            <option value={orderStatus.ALL}>Estado de Orden</option>
            <option value={orderStatus.PENDING}>Pendiente</option>
            <option value={orderStatus.PROCESSING}>Procesando</option>
            <option value={orderStatus.SHIPPED}>Enviado</option>
            <option value={orderStatus.DELIVERED}>Entregado</option>
            <option value={orderStatus.CANCELED}>Cancelado</option>
          </select>
        </div>

        {/* MENSAJE DE ERROR */}
        {errorMessage && (
          <p className="text-red-600 text-sm mb-3">{errorMessage}</p>
        )}
      </Card>

      {/* LISTADO */}
      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-4 text-gray-500">
            Cargando órdenes...
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    #{order.id} - {order.customerName ?? 'Cliente Sin Nombre'}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Estado:{' '}
                    <span className="font-semibold">
                      {order.status ?? 'Desconocido'}
                    </span>
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Fecha:{' '}
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>

                <button
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold text-sm px-6 py-2 rounded-lg transition-colors"
                  onClick={() => toggleExpand(order.id)}
                >
                  {expandedId === order.id ? 'Cerrar' : 'Ver'}
                </button>
              </div>

              {/* EXPANDIBLE */}
              {expandedId === order.id && (
                <div className="mt-4 border-t pt-3 text-sm text-gray-700">
                  <p>
                    <span className="font-bold">Dirección de envío:</span>{' '}
                    {order.shippingAddress ?? 'N/A'}
                  </p>
                  <p>
                    <span className="font-bold">Dirección de facturación:</span>{' '}
                    {order.billingAddress ?? 'N/A'}
                  </p>
                  <p>
                    <span className="font-bold">Monto total:</span> $
                    {order.totalAmount ?? 'N/A'}
                  </p>

                  <p className="mt-2 font-bold">Productos:</p>
                  <ul className="list-disc ml-5 text-gray-600">
                    {order.orderItems?.map((item, index) => (
                      <li key={item.productId || index}>
                        {item.name} – Cant: {item.quantity} – Subtotal: $
                        {item.subtotal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No se encontraron órdenes.
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex flex-wrap justify-center items-center mt-6 gap-4 text-sm text-gray-700 font-medium pb-10">

        {/* PREVIOUS */}
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber((p) => p - 1)}
          className="px-3 py-1 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>

        {/* NÚMEROS */}
        <div className="flex items-center gap-2">
          {/* Página actual */}
          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white font-bold">
            {pageNumber}
          </span>

          {/* Página siguiente */}
          {pageNumber < totalPages && (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              {pageNumber + 1}
            </button>
          )}

          {/* ... */}
          {pageNumber + 1 < totalPages && (
            <span className="px-1">...</span>
          )}

          {/* Última página */}
          {pageNumber + 2 < totalPages && (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition"
              onClick={() => setPageNumber(totalPages)}
            >
              {totalPages}
            </button>
          )}
        </div>

        {/* NEXT */}
        <button
          disabled={pageNumber >= totalPages}
          onClick={() => setPageNumber((p) => p + 1)}
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
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNumber(1);
            }}
            className="border border-gray-300 rounded-lg px-2 py-1 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default ListOrdersPage;