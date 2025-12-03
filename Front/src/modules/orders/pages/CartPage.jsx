import { useState } from 'react';
import Button from '../../shared/components/Button';
import { useCart } from '../context/CartContext';
import Toast from '../../shared/components/Toast';
import { useNavigate } from 'react-router-dom';

// MODALES
import { LoginModal, RegisterModal } from '../../auth/pages/AuthModals';

// AUTH & API
import useAuth from '../../auth/hook/useAuth';
import { createOrder } from '../services/create';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // ESTADOS PARA LA LÓGICA
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const showToast = msg => setToast(msg);

  const getStockFromItem = item => Number(
    item.stockQuantity ?? item.stock ?? item.stockAvailable ?? item.currentStock ?? 0,
  );

  // --- NUEVO: CALCULO DE TOTAL DE UNIDADES ---
  // Sumamos la propiedad 'quantity' de cada item en el carrito
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- LÓGICA DE COMPRA ---
  const handleFinalizePurchase = async () => {
    // 1. Validar Autenticación
    if (!isAuthenticated) {
      setShowLoginModal(true);

      return;
    }

    // 2. Validar Inputs
    if (!shippingAddress.trim() || !billingAddress.trim()) {
      showToast('Por favor, completa las direcciones de envío y facturación.');

      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerId: '00000000-0000-0000-0000-000000000000',
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);

      showToast('¡Compra realizada con éxito!');

      if (clearCart) clearCart();

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error al procesar compra:', error);

      if (error.response && error.response.data) {
        const serverError = error.response.data.message
                          || error.response.data.title
                          || JSON.stringify(error.response.data);

        showToast(`Error: ${serverError}`);
      } else {
        showToast(error.message || 'Hubo un error al crear la orden.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-400 gap-4">
        <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 114 0 2 2 0 01-4 0z"/>
        </svg>
        <div className="text-xl">Tu carrito está vacío</div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start pb-20 relative">

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
        onLoginSuccess={() => setShowLoginModal(false)}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* ITEMS DEL CARRITO */}
      <div className="w-full flex-1 flex flex-col gap-4">
        {cartItems.map(item => {
          const stock = getStockFromItem(item);

          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>

                {/* MODIFICADO: Layout vertical para coincidir con la imagen */}
                <div className="text-gray-500 text-sm flex flex-col gap-1">

                  {/* Cantidad seleccionada en texto */}
                  <span>Cantidad de productos: {item.quantity}</span>

                  {/* Subtotal */}
                  <span>
                    Sub Total: <span className="font-medium text-gray-700">${(Number(item.price ?? 0) * item.quantity).toFixed(2)}</span>
                  </span>

                  {/* Stock (información extra útil, un poco más pequeña) */}
                  <span className="text-xs text-gray-400 mt-1">Stock disponible: {stock}</span>
                </div>
              </div>

              {/* CONTROLES DE CANTIDAD Y BOTÓN BORRAR */}
              <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6 border-t border-gray-100 pt-4 lg:pt-0 lg:border-0 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                    }}
                    className="w-6 h-6 flex items-center justify-center font-bold text-gray-900 hover:text-gray-600 pb-1"
                  >
                    −
                  </button>

                  <div className="bg-white border border-gray-200 w-10 h-8 flex items-center justify-center rounded text-sm">
                    {item.quantity}
                  </div>

                  <button
                    onClick={() => {
                      if (item.quantity >= stock) {
                        showToast(`Solo hay ${stock} unidades disponibles`);

                        return;
                      }

                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    disabled={item.quantity >= stock}
                    className={`w-6 h-6 flex items-center justify-center font-bold pb-1 rounded ${
                      item.quantity >= stock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:text-gray-600'
                    }`}
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-1.5 rounded-lg text-sm font-medium"
                >
                  Borrar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETALLE DE PEDIDO (SUMMARY) */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">

          <div className="text-gray-700 text-base mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Detalle de pedido</h2>

            {/* MODIFICADO: Muestra el total de unidades calculado con reduce */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Cantidad de productos en total:</span>
              <span>{totalUnits}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Dirección de Envío</label>
            <input
              type="text"
              placeholder="Ej: Av. Libertador 1234"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Dirección de Facturación</label>
            <input
              type="text"
              placeholder="Ej: Av. Libertador 1234"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-between text-gray-700 text-lg font-semibold mb-6 pt-4 border-t border-gray-100">
            <span>Total a pagar:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <Button
            onClick={handleFinalizePurchase}
            disabled={isSubmitting}
            className={`w-full text-white py-3 rounded-lg text-lg font-medium 
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
            `}
          >
            {isSubmitting ? 'Procesando...' : 'Finalizar compra'}
          </Button>
        </div>
      </div>

    </div>
  );
}

export default CartPage;