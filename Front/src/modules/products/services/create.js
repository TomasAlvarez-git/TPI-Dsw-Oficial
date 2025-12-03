import { instance } from '../../shared/api/axiosInstance';

export const createProduct = async (formData) => {
  return await instance.post('/api/products', {
    sku: formData.sku,
    internalCode: formData.cui,
    name: formData.name,
    description: formData.description,
    currentPrice: formData.price,
    stockQuantity: formData.stock,
  });

};
