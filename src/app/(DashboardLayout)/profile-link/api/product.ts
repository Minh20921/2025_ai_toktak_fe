import API from '@service/api';
import type {
  CrawlProductResponse,
  GroupListResponse,
  Product,
  ProductListResponse,
  TreeNode,
} from '@/app/(DashboardLayout)/profile-link/@type/interface';

export const productAPI = {
  crawlProduct: async (url: string): Promise<CrawlProductResponse> => {
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const raw = await res.json();

      const data: CrawlProductResponse = raw?.data && typeof raw.data === 'object' ? raw.data : raw;

      return data;
    } catch (err) {
      console.error('crawlProduct error:', err);
      throw err;
    }
  },
  getGroups: async (params: {
    page: number;
    per_page: number;
    user_id: number;
    search_key?: string;
    type_order?: string;
  }): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/user_group_products', 'GET', {
        success: (res: GroupListResponse) => resolve(res),
        error: (err) => {
          console.error('getProduct error:', err);
          resolve([]);
          // reject(err);
        },
      });

      api.set({ params: params });

      api.call();
    });
  },
  getProduct: async (params: {
    page: number;
    per_page: number;
    user_id: number;
    search_key?: string;
    type_order?: string;
    group_id?: string;
  }): Promise<ProductListResponse> => {
    if (params.group_id) {
      return new Promise((resolve, reject) => {
        resolve({
          data: [],
          page: 1,
          per_page: 10,
          total: 0,
          total_pages: 1,
        });
      });
    }
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/user_products', 'GET', {
        success: (res: ProductListResponse) => resolve(res),
        error: (err) => {
          console.error('getProduct error:', err);
          reject(err);
        },
      });

      api.set({ params: params });

      api.call();
    });
  },
  // Updated to use the correct product_create endpoint
  createProduct: async (productData: Product[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/multi_product_create', 'POST', {
        success: (res: any) => resolve(res),
        error: (err) => {
          console.error('createProduct error:', err);
          reject(err);
        },
      });
      api.config.isForm = true;
      api.config.data = productData;
      api.call();
    });
  },
  // Updated to use the correct product_update endpoint
  updateProduct: async (productData: {
    id: number | string;
    product_name: string;
    product_url: string;
    product_image: string;
    price: string;
  }): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/product_update', 'POST', {
        success: (res: any) => resolve(res),
        error: (err) => {
          console.error('updateProduct error:', err);
          reject(err);
        },
      });

      api.set({ data: productData });

      api.call();
    });
  },

  updateProductsMulti: async (products: Product[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/product_update_multi', 'POST', {
        success: (res: any) => resolve(res),
        error: (err) => {
          console.error('updateProductsMulti error:', err);
          reject(err);
        },
      });
      api.config.isForm = true;
      api.config.data = products;
      api.call();
    });
  },

  // Updated delete product function to use the correct endpoint
  deleteProduct: async (productIds: Array<number | string>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/product_delete', 'POST', {
        success: (res: any) => resolve(res),
        error: (err) => {
          console.error('deleteProduct error:', err);
          reject(err);
        },
      });

      api.set({ data: { product_ids: productIds.join(',') } });

      api.call();
    });
  },
  createGroup: async (groupData: Array<TreeNode>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/multi_group_create', 'POST', {
        success: (res: any) => resolve(res),
        error: (err) => {
          console.error('createProduct error:', err);
          reject(err);
        },
      });

      api.set({
        data: {
          products: groupData,
        },
      });

      api.call();
    });
  },

  updateGroup: async (groupData: Array<TreeNode>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/group_update', 'POST', {
        success: (res: any) => resolve(res),
        error: (err) => {
          console.error('createProduct error:', err);
          reject(err);
        },
      });

      api.set({
        data: {
          products: groupData,
        },
      });

      api.call();
    });
  },
  deleteGroup: async (groupIds: Array<number | string>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/group_delete', 'POST', {
        success: (res: any) => resolve(res),
        error: (err) => {
          console.error('deleteGroup error:', err);
          reject(err);
        },
      });

      api.set({ data: { group_ids: groupIds.join(',') } });

      api.call();
    });
  },
  getProductImgUrl: async (product_image_file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/product/save_product_image', 'POST', {
        success: (res: GroupListResponse) => resolve(res),
        error: (err) => {
          console.error('getProductImgUrl error:', err);
          resolve([]);
          // reject(err);
        },
      });

      api.config.isForm = true;
      api.config.data = { product_image_file };
      api.call();
    });
  },
};
