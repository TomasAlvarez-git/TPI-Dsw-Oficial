import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await instance.get(
      `/api/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );

    return {
      data: response.data,
      errorCode: null,
      errorMessageDev: null,
    };

  } catch (error) {
    const backend = error?.response?.data;

    return {
      data: null,
      errorCode: backend?.errorCode ?? 2001, // 2001 = error listando ordenes
      errorMessageDev: backend?.message ?? 'Unexpected order listing error',
    };
  }
};
