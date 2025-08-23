import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/messages',
  list: 'api/v1/admin/messages'
};

export const messagesFetcher = (url, config) => fetcher([url, config]);

export function useGetMessages(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, messagesFetcher);

  return useMemo(() => ({ messages: data || [], messagesLoading: isLoading, messagesError: error }), [data, isLoading, error]);
}

export async function getMessages(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}

export async function getMessageById(id) {
  const res = await axiosServices.get(`${endpoints.list}/${id}`);
  return res.data;
}

export async function createMessage(payload) {
  const res = await axiosServices.post(endpoints.list, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function updateMessage(id, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${id}`, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function removeMessage(id) {
  const res = await axiosServices.delete(`${endpoints.list}/${id}`);
  mutate(endpoints.list);
  return res.data;
}
