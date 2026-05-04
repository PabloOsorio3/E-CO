import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchProducts } from '../store/slices/product.slice';
import { fetchCategories } from '../store/slices/category.slice';
import { fetchSubCategories } from '../store/slices/subcategorie.slice';
import { fetchBrands } from '../store/slices/brand.slice';
import { fetchStatus } from '../store/slices/status.slice';

export const useAppInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchBrands());
    dispatch(fetchStatus());
  }, [dispatch]);
};
