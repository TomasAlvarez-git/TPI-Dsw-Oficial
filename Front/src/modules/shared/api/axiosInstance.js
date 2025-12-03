import axios from 'axios';

const instance = axios.create({
  baseURL: '',
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // No enviar token al endpoint público
    if (config.url.startsWith('/api/products') && !config.url.includes('/admin')) {
      return config; // NO agregar Authorization
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

export { instance };

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Solo evitar token para GET públicos (si querés eso)
  const isPublicGetProducts =
    config.method === 'get' &&
    config.url.startsWith('/api/products');

  if (!isPublicGetProducts && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
