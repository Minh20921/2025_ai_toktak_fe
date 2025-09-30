import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { addTempProduct, markProductForDeletion } from '@/app/lib/store/profileSlice';
import { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';

export function useProductEditor() {
  const dispatch = useDispatch();
  const tempProducts = useSelector((state: RootState) => state.profile.tempProducts);
  const products = useSelector((state: RootState) => state.profile.products);
  const deletedIds = useSelector((state: RootState) => state.profile.deletedProductIds);

  const getCombinedProductsList = useCallback(() => {
    const map: Record<string, Product> = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    tempProducts.forEach((p) => {
      map[p.id] = p;
    });
    deletedIds.forEach((id) => {
      delete map[id];
    });
    return Object.values(map);
  }, [products, tempProducts, deletedIds]);

  const updateProduct = (product: Product) => {
    dispatch(addTempProduct(product));
  };

  const deleteProduct = (id: string) => {
    dispatch(markProductForDeletion({ id }));
  };

  const addProduct = (product: Product) => {
    dispatch(addTempProduct(product));
  };

  return {
    getCombinedProductsList,
    updateProduct,
    deleteProduct,
    addProduct,
  };
}
