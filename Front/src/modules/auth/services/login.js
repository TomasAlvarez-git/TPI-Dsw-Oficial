// src/services/login.js
import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await instance.post('api/auth/login', { username, password });

    const token = response.data?.token;

    if (!token) {
      return {
        data: null,
        error: { code: 1900 }, // Error inesperado de autenticación
      };
    }

    // Decodificar JWT con fallback seguro
    let payload;

    try {
      payload = JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {
        data: null,
        error: { code: 1201 }, // Token inválido o dañado
      };
    }

    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.toLowerCase() || null;

    return {
      data: { token, role },
      error: null,
    };

  } catch (error) {
    return {
      data: null,
      error: {
        code: error?.response?.data?.code || 1901, // Error al acceder al servicio de auth
      },
    };
  }
};
