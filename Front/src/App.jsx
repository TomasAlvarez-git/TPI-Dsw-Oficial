import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { CartProvider } from './modules/orders/context/CartContext'; 

import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import HomeAdmin from './modules/home/pages/HomeAdmin';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';

// Importa los componentes públicos
import PublicLayout from './modules/templates/components/PublicLayout';
import HomePage from './modules/home/pages/Home';
import CartPage from './modules/orders/pages/CartPage';
import SignUpPage from './modules/auth/pages/SignUpPage';

function App() {
  const router = createBrowserRouter([
    // --- RUTAS PÚBLICAS ---
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'cart',
          element: <CartPage />,
        },
      ],
    },
    {
      path: '/signup',
      element: <SignUpPage/>,
    },
    // --- LOGIN ---
    {
      path: '/login',
      element: <LoginPage />,
    },

    // --- ADMIN ---
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: 'home', element: <HomeAdmin /> },
        { path: 'products', element: <ListProductsPage /> },
        { path: 'products/create', element: <CreateProductPage /> },
        { path: 'orders', element: <ListOrdersPage /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      {/* 2. ENVOLVER LA APP CON EL PROVIDER DEL CARRITO */}
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;