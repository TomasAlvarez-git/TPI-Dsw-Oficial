import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../shared/components/Button';
import { LoginModal, RegisterModal } from '../../auth/pages/AuthModals';
import useAuth from '../../auth/hook/useAuth';

function PublicLayout() {
  const { isAuthenticated, signout } = useAuth();

  useEffect(() => {
  }, [isAuthenticated]);

  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
    navigate(`/?search=${value}`);
  };

  const handleLogout = () => {
    signout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">

      {/* MODALES */}
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

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between gap-4">

          {/* LOGO */}
          <div className="flex items-center gap-6 lg:gap-8 shrink-0">
            <Link to="/" className="flex items-center">
              <div className="text-black">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </Link>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex gap-2 text-sm font-medium text-gray-600">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/' ? 'bg-gray-100 text-gray-900 font-semibold' : 'hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Productos
              </Link>

              <Link
                to="/cart"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/cart' ? 'bg-gray-100 text-gray-900 font-semibold' : 'hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Carrito de compras
              </Link>
            </nav>
          </div>

          {/* SEARCH */}
          <div className="flex-1 max-w-2xl mx-2 lg:mx-4">
            <div className="relative group">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search"
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-full pl-4 pr-10 py-2 shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* ACCIONES DESKTOP */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2 rounded-lg text-sm font-semibold"
              >
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  Iniciar Sesión
                </Button>

                <Button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* MENU MOBILE */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white p-4 flex flex-col gap-4 shadow-lg absolute w-full z-40">
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium py-2">Productos</Link>

              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium py-2">Carrito de compras</Link>
            </nav>

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 py-2 rounded-lg"
                >
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}
                    className="w-full bg-purple-100 text-purple-700 py-2 rounded-lg"
                  >
                    Iniciar Sesión
                  </Button>

                  <Button
                    onClick={() => { setShowRegisterModal(true); setIsMenuOpen(false); }}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 lg:py-10">
        <Outlet context={{ openLogin: () => setShowLoginModal(true), openRegister: () => setShowRegisterModal(true) }} />
      </main>
    </div>
  );
}

export default PublicLayout;
