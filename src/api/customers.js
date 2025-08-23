import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/customers',
  list: 'api/v1/admin/customers/'
};

export const customersFetcher = (url, config) => fetcher([url, config]);

export function useGetCustomers(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, customersFetcher);

  return useMemo(() => ({ customers: data || [], customersLoading: isLoading, customersError: error }), [data, isLoading, error]);
}

export function useGetCustomer(id) {
  const url = id ? `${endpoints.list}/${id}` : null;
  const { data, isLoading, error } = useSWR(url, customersFetcher);

  return useMemo(() => ({ customer: data, customerLoading: isLoading, customerError: error }), [data, isLoading, error]);
}

export async function getCustomers(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}

export async function getCustomerById(id) {
  const res = await axiosServices.get(`${endpoints.list}/${id}`);
  return res.data;
}

export async function createCustomer(payload) {
  const res = await axiosServices.post(endpoints.list, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function updateCustomer(id, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${id}`, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function removeCustomer(id) {
  const res = await axiosServices.delete(`${endpoints.list}/${id}`);
  mutate(endpoints.list);
  return res.data;
}
