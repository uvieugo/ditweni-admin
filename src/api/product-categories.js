import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/product_categories',
  list: 'api/v1/admin/product_categories'
};

export const productsFetcher = (url, config) => fetcher([url, config]);

export function useGetProductCategories(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, productsFetcher);

  return useMemo(
    () => ({ productCategories: data || [], productCategoriesLoading: isLoading, productCategoriesError: error }),
    [data, isLoading, error]
  );
}

export function useGetProductCategory(id) {
  const url = id ? `${endpoints.list}/${id}` : null;
  const { data, isLoading, error } = useSWR(url, productsFetcher);

  return useMemo(
    () => ({ productCategory: data, productCategoryLoading: isLoading, productCategoryError: error }),
    [data, isLoading, error]
  );
}

export async function getProductCategories(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}

export async function getProductCategoryById(id) {
  const res = await axiosServices.get(`${endpoints.list}/${id}`);
  return res.data;
}

export async function createProductCategory(payload) {
  const res = await axiosServices.post(endpoints.list, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function updateProductCategory(id, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${id}`, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function removeProductCategory(id) {
  const res = await axiosServices.delete(`${endpoints.list}/${id}`);
  mutate(endpoints.list);
  return res.data;
}

export async function uploadImage(formData) {
  const res = await axiosServices.post('api/v1/admin/products_categories/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}
