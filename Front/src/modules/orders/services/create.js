import { instance } from '../../shared/api/axiosInstance';

export const createOrder = async (orderData) => {
  try {
    const response = await instance.post('/api/orders', {
      customerId: orderData.customerId,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      orderItems: orderData.orderItems,
    });

    return {
      data: response.data,
      errorCode: null,
      errorMessageDev: null,
    };

  } catch (error) {
    const backend = error?.response?.data;

    return {
      data: null,
      errorCode: backend?.errorCode ?? 2000, // 2000 = error genérico de órdenes
      errorMessageDev: backend?.message ?? 'Unexpected order creation error',
    };
  }
};
