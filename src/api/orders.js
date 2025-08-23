import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/orders',
  list: 'api/v1/admin/orders'
};

export const ordersFetcher = (url, config) => fetcher([url, config]);

export function useGetOrders(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, ordersFetcher);

  return useMemo(() => ({ orders: data || [], ordersLoading: isLoading, ordersError: error }), [data, isLoading, error]);
}

export function useGetOrder(id) {
  const url = id ? `${endpoints.list}/${id}` : null;
  const { data, isLoading, error } = useSWR(url, ordersFetcher);

  return useMemo(() => ({ order: data, orderLoading: isLoading, orderError: error }), [data, isLoading, error]);
}

export async function getOrders(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}

export async function getOrderById(id) {
  const res = await axiosServices.get(`${endpoints.list}/${id}`);
  return res.data;
}

export async function createOrder(payload) {
  const res = await axiosServices.post(endpoints.list, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function updateOrder(id, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${id}`, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function removeOrder(id) {
  const res = await axiosServices.delete(`${endpoints.list}/${id}`);
  mutate(endpoints.list);
  return res.data;
}

// Order Items API functions
export async function getOrderItems(orderId) {
  const res = await axiosServices.get(`${endpoints.list}/${orderId}/items`);
  return res.data;
}

export async function createOrderItem(orderId, payload) {
  const res = await axiosServices.post(`${endpoints.list}/${orderId}/items`, payload);
  mutate(`${endpoints.list}/${orderId}`);
  mutate(`${endpoints.list}/${orderId}/items`);
  return res.data;
}

export async function updateOrderItem(orderId, itemId, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${orderId}/items/${itemId}`, payload);
  mutate(`${endpoints.list}/${orderId}`);
  mutate(`${endpoints.list}/${orderId}/items`);
  return res.data;
}

export async function removeOrderItem(orderId, itemId) {
  const res = await axiosServices.delete(`${endpoints.list}/${orderId}/items/${itemId}`);
  mutate(`${endpoints.list}/${orderId}`);
  mutate(`${endpoints.list}/${orderId}/items`);
  return res.data;
}
