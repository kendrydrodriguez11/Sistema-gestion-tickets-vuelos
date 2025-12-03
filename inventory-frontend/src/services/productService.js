import api from './api';
import {jwtDecode} from 'jwt-decode';

const productService = {
  async getAllProducts(page = 0, size = 10) {
    const response = await api.get('/api/inventory/products', {
      params: { page, size },
    });
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/api/inventory/products/${id}`);
    return response.data;
  },

  async createProduct(productData, bucketName = 'my-inventory-bucketken') {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.idUser;

    // 🔥 Separar archivo de imagen de los datos del producto
    const imageFile = productData.image;
    const productInfo = { ...productData };
    delete productInfo.image;

    // 1️⃣ Crear producto y obtener uploadUrl
    const response = await api.post('/api/inventory/products', productInfo, {
      params: { bucketName },
      headers: {
        'X-User-Id': userId,
      },
    });

    const { uploadUrl, ...createdProduct } = response.data;

    // 2️⃣ Si hay imagen y uploadUrl, subir a S3
    if (uploadUrl && imageFile) {
      try {
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': imageFile.type,
          },
          body: imageFile,
        });
        
        if (!uploadResponse.ok) {
          console.error('❌ Error subiendo imagen:', await uploadResponse.text());
          throw new Error('Failed to upload image');
        }
        console.log('✅ Imagen subida correctamente');
      } catch (error) {
        console.error('❌ Error en upload:', error);
        throw error;
      }
    }

    return createdProduct;
  },

  async updateProduct(id, productData) {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.idUser;

    const response = await api.put(`/api/inventory/products/${id}`, productData, {
      headers: {
        'X-User-Id': userId,
      },
    });
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/api/inventory/products/${id}`);
    return response.data;
  },

  async searchProducts(keyword, page = 0, size = 10) {
    const response = await api.get('/api/inventory/products/search', {
      params: { keyword, page, size },
    });
    return response.data;
  },

  async getLowStockProducts(page = 0, size = 10) {
    const response = await api.get('/api/inventory/products/low-stock', {
      params: { page, size },
    });
    return response.data;
  },

  async getProductsByCategory(category, page = 0, size = 10) {
    const response = await api.get(`/api/inventory/products/category/${category}`, {
      params: { page, size },
    });
    return response.data;
  },
};

export default productService;