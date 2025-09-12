import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/payment_methods',
  list: 'api/v1/admin/payment_methods',
  one: (id) => `api/v1/admin/payment_methods/${id}` // for single item
};

export const paymentMethodsFetcher = (url, config) => fetcher([url, config]);

export function useGetPaymentMethods(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, paymentMethodsFetcher);

  return useMemo(
    () => ({ paymentMethods: data || [], paymentMethodsLoading: isLoading, paymentMethodsError: error }),
    [data, isLoading, error]
  );
}

export function useGetPaymentMethod(id) {
  const url = id ? `${endpoints.list}/${id}` : null;
  const { data, isLoading, error } = useSWR(url, paymentMethodsFetcher);

  return useMemo(() => ({ paymentMethod: data, paymentMethodLoading: isLoading, paymentMethodError: error }), [data, isLoading, error]);
}

export async function getPaymentMethods(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}

export async function getPaymentMethodById(id) {
  const res = await axiosServices.get(`${endpoints.list}/${id}`);
  return res.data;
}

export async function createPaymentMethod(payload) {
  const res = await axiosServices.post(endpoints.list, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function updatePaymentMethod(id, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${id}`, payload);
  // mutate(endpoints.list);
  return res.data;
}

export async function removePaymentMethod(id) {
  const res = await axiosServices.delete(`${endpoints.list}/${id}`);
  mutate(endpoints.list);
  return res.data;
}
