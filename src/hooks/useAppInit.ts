import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchProducts } from '../store/slices/product.slice';
import { fetchCategory } from '../store/slices/category.slice';
import { fetchSubCategory } from '../store/slices/subcategory.slice';
import { fetchBrands } from '../store/slices/brand.slice';
import { fetchStatus } from '../store/slices/status.slice';

export const useAppInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategory());
    dispatch(fetchSubCategory());
    dispatch(fetchBrands());
    dispatch(fetchStatus());
  }, [dispatch]);
};
