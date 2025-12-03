import { useEffect, useState } from 'react';
import { getPublicProducts } from '../../products/services/list';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useCart } from '../../orders/context/CartContext';
import { useSearchParams } from 'react-router-dom';
import { filterProductsBySearch, getSearchParam } from '../services/search';
import Toast from '../../shared/components/Toast';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState(null);

  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const search = getSearchParam(searchParams);

  const showToast = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await getPublicProducts();

        setProducts(data || []);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    setQuantities(prev => {
      let changed = false;
      const next = { ...prev };

      products.forEach(p => {
        const sku = p.sku;
        const stock = getStockFromProduct(p);
        const current = next[sku] || 0;

        if (current > stock) {
          next[sku] = stock;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [products]);

  const filteredProducts = filterProductsBySearch(products, search);

  function getStockFromProduct(product) {
    return Number(
      product.stockQuantity ??
      product.stock ??
      product.stockAvailable ??
      product.currentStock ??
      product.quantity ??
      0,
    );
  }

  const handleQuantityChange = (sku, delta, product) => {
    const stock = getStockFromProduct(product);

    setQuantities(prev => {
      const current = prev[sku] || 0;
      const newValue = current + delta;

      if (newValue < 0) return { ...prev, [sku]: 0 };

      if (newValue > stock) {
        showToast(`Solo hay ${stock} unidades disponibles`);

        return prev;
      }

      return { ...prev, [sku]: newValue };
    });
  };

  const handleQuantitySet = (sku, value, product) => {
    const stock = getStockFromProduct(product);
    const num = Number.isNaN(Number(value))
      ? 0
      : Math.max(0, Math.floor(Number(value)));

    if (num > stock) {
      showToast(`Solo hay ${stock} unidades disponibles`);
      setQuantities(prev => ({ ...prev, [sku]: stock }));

      return;
    }

    setQuantities(prev => ({ ...prev, [sku]: num }));
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.sku] || 0;
    const stock = getStockFromProduct(product);

    if (qty <= 0) {
      showToast('Seleccioná al menos 1 unidad');

      return;
    }

    if (qty > stock) {
      showToast(`No puedes agregar más de ${stock} unidades`);

      return;
    }

    addToCart(product, qty);
    setQuantities(prev => ({ ...prev, [product.sku]: 0 }));
    showToast('Producto agregado al carrito');
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-400">Cargando productos...</div>;

  return (
    <div className="pb-10 relative">

      {/* TOAST GLOBAL */}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-wrap gap-6">
        {filteredProducts.map((product) => {
          const sku = product.sku;
          const quantity = quantities[sku] || 0;
          const stock = getStockFromProduct(product);

          return (
            <Card
              key={sku}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full flex-grow w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              <div className="bg-gray-200 aspect-square rounded-lg mb-4 flex items-center justify-center text-gray-300">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>
                </svg>
              </div>

              <div className="flex flex-col flex-1">
                <h3 className="text-gray-800 font-medium text-base leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex-1" />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.currentPrice ?? product.currentUnitPrice ?? '0.00'}
                  </span>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() => handleQuantityChange(sku, -1, product)}
                      className="w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors pb-1"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => handleQuantitySet(sku, e.target.value, product)}
                      className="w-14 h-8 text-center border border-gray-200 rounded-md"
                    />

                    <button
                      type="button"
                      onClick={() => handleQuantityChange(sku, 1, product)}
                      disabled={quantity >= stock}
                      className={`w-8 h-8 flex items-center justify-center text-xl font-bold pb-1 ${
                        quantity >= stock
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-800 hover:text-purple-600'
                      }`}
                    >
                      +
                    </button>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={quantity === 0}
                      className={`ml-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        quantity > 0
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>

                <span className="mt-2 text-xs text-gray-400">Stock: {stock}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
