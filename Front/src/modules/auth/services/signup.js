// src/services/signup.js
import { instance } from '../../shared/api/axiosInstance';

export const signup = async (data) => {
  try {
    const endpoint =
      data.role === 'Admin'
        ? '/api/auth/registerAdmin'
        : '/api/auth/registerCustomer';

    const payload = {
      username: data.username,
      password: data.password,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };

    const response = await instance.post(endpoint, payload);

    return {
      data: {
        token: response.data?.token || null,
        role: response.data?.role?.toLowerCase() || data.role?.toLowerCase(),
      },
      error: null,
    };

  } catch (error) {
    return {
      data: null,
      error: {
        code: error?.response?.data?.code || 1100, // No pudimos registrar tu cuenta
      },
    };
  }
};
