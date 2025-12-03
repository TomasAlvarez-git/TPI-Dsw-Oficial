import { useEffect, useState } from 'react';

// Servicios según tu estructura
import { getAuthProducts } from '../../products/services/list';
import { listOrders } from '../../orders/services/listServices';

function HomeAdmin() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // === Productos ===
        const respuesta = await getAuthProducts(1, 1);

        console.log('🔍 RESPUESTA FINAL:', respuesta);

        // CORRECCIÓN: Buscamos 'total' DIRECTAMENTE en la respuesta
        // En tu consola se ve: { data: [...], total: 26 }
        // Así que respuesta.total es lo que queremos.

        const totalProducts =
          respuesta?.total ??                  // <--- AQUÍ ESTÁ EL 26
          respuesta?.data?.total ??            // Por si acaso viniera anidado
          respuesta?.list?.total ??            // Otra variante común
          respuesta?.data?.length ??           // Si no hay total, contamos lo que hay (10)
          0;

        setProductsCount(totalProducts);

        // === Órdenes ===
        const { data: ordersData } = await listOrders(1, 1);
        const totalOrders =
          ordersData?.total ??
          ordersData?.orderItems?.length ??
          0;

        setOrdersCount(totalOrders);

      } catch (error) {
        console.error('Error al cargar los totales:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="w-full p-2 sm:p-4">

      {/* Título */}
      <h1 className="text-xl font-bold mb-4 text-gray-800 sm:text-2xl">
        Principal
      </h1>

      {/* Grid de tarjetas */}
      <div className="grid gap-4 sm:grid-cols-1">

        {/* Card Productos */}
        <div className="
          bg-white
          border border-gray-200
          rounded-2xl
          shadow-sm
          p-4
        ">
          <h2 className="text-lg font-semibold text-gray-900">
            Productos
          </h2>

          <p className="text-gray-600 mt-3 text-sm">
            Cantidad de<br />
            Productos: <strong>{productsCount}</strong>
          </p>
        </div>

        {/* Card Órdenes */}
        <div className="
          bg-white
          border border-gray-200
          rounded-2xl
          shadow-sm
          p-4
        ">
          <h2 className="text-lg font-semibold text-gray-900">
            Órdenes
          </h2>

          <p className="text-gray-600 mt-3 text-sm">
            Cantidad de<br />
            Órdenes: <strong>{ordersCount}</strong>
          </p>
        </div>

      </div>
    </div>
  );
}

export default HomeAdmin;
