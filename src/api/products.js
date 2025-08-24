import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/products',
  list: 'api/v1/admin/products'
};

export const productsFetcher = (url, config) => fetcher([url, config]);

export function useGetProducts(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, productsFetcher);

  return useMemo(() => ({ products: data || [], productsLoading: isLoading, productsError: error }), [data, isLoading, error]);
}

export function useGetProduct(id) {
  const url = id ? `${endpoints.list}/${id}` : null;
  const { data, isLoading, error } = useSWR(url, productsFetcher);

  return useMemo(() => ({ product: data, productLoading: isLoading, productError: error }), [data, isLoading, error]);
}

export async function getProducts(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}

export async function getProductById(id) {
  const res = await axiosServices.get(`${endpoints.list}/${id}`);
  return res.data;
}

export async function createProduct(payload) {
  const res = await axiosServices.post(endpoints.list, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function updateProduct(id, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${id}`, payload);
  // mutate(endpoints.list);
  return res.data;
}

export async function removeProduct(id) {
  const res = await axiosServices.delete(`${endpoints.list}/${id}`);
  mutate(endpoints.list);
  return res.data;
}

export async function uploadImage(formData) {
  const res = await axiosServices.post('api/v1/admin/products/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}
