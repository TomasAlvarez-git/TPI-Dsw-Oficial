import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { PaginationControl } from '../../shared/components/PaginationControl'; // <--- Usamos el nuevo componente
import { getAuthProducts } from '../services/list';
import { productStatus } from '../services/productStatus';
import { usePagination } from '../../shared/hooks/usePagination';

function ListProductsPage() {
  const navigate = useNavigate();
  const { page, pageSize, changePage, changePageSize, resetPage } = usePagination();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [dataState, setDataState] = useState({ products: [], total: 0, loading: false, error: null });
  const [expandedId, setExpandedId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setDataState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const normalizedSearch = searchTerm?.toLowerCase() || '';
      const response = await getAuthProducts(normalizedSearch, status, page, pageSize);

      if (response.error) throw new Error(response.error);

      setDataState({
        products: response.data || [],
        total: response.total || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(error);
      setDataState(prev => ({ ...prev, loading: false, error: 'Error al cargar los productos.' }));
    }
  }, [searchTerm, status, page, pageSize]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); resetPage(); };
  const handleStatusChange = (e) => { setStatus(e.target.value); resetPage(); };
  const toggleExpand = (id) => { setExpandedId(prev => (prev === id ? null : id)); };

  const totalPages = Math.ceil(dataState.total / pageSize) || 1;

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-bold text-gray-800'>Productos</h1>
          <Button className='bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold px-4 py-2 rounded-lg' onClick={() => navigate('/admin/products/create')}>
            Crear Producto
          </Button>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 mb-2'>
          <div className='flex items-center gap-2 flex-1'>
            <input value={searchTerm} onChange={handleSearchChange} type="text" placeholder='Buscar por SKU o Nombre' className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200' />
          </div>
          <select value={status} onChange={handleStatusChange} className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white'>
            <option value={productStatus.ALL}>Todos los estados</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      {dataState.error && <div className="text-red-600 mt-4">{dataState.error}</div>}

      <div className='mt-4 flex flex-col gap-3'>
        {dataState.loading ? (
          <div className="text-center py-10 text-gray-500">Cargando productos...</div>
        ) : (
          dataState.products.map((product) => {
            const uniqueKey = product.sku || product.id;
            const priceFormatted = Number(product.currentPrice || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

            return (
              <Card key={uniqueKey} className="p-4 transition hover:shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className='text-lg font-bold text-gray-800'>{product.sku} - {product.name}</h3>
                    <p className='text-sm text-gray-500 mt-1'>
                      Stock: <span className="font-semibold text-gray-700">{product.stockQuantity}</span>
                      {' '} - {' '}
                      <span className={`font-medium ${product.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {product.isActive ? 'Habilitado' : 'Inhabilitado'}
                      </span>
                    </p>
                  </div>
                  <button className='bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold text-sm px-6 py-2 rounded-lg' onClick={() => toggleExpand(uniqueKey)}>
                    {expandedId === uniqueKey ? 'Cerrar' : 'Ver'}
                  </button>
                </div>
                {expandedId === uniqueKey && (
                  <div className="mt-4 border-t pt-3 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p><strong>ID:</strong> {product.id}</p>
                      <p><strong>Código:</strong> {product.internalCode || 'N/A'}</p>
                      <p><strong>Descripción:</strong><br />{product.description || 'Sin descripción'}</p>
                    </div>
                    <div>
                      <p><strong>Precio:</strong> <span className="text-lg text-green-700 font-bold">{priceFormatted}</span></p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {!dataState.loading && !dataState.error && dataState.products.length > 0 && (
        <PaginationControl
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />
      )}
    </div>
  );
}

export default ListProductsPage;