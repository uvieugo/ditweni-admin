import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/site_settings',
  list: 'api/v1/admin/site_settings',
  one: (id) => `api/v1/admin/site_settings/${id}` // for single item
};

export const siteSettingsFetcher = (url, config) => fetcher([url, config]);

export function useGetSiteSettings(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, siteSettingsFetcher);

  return useMemo(() => ({ siteSettings: data || [], siteSettingsLoading: isLoading, siteSettingsError: error }), [data, isLoading, error]);
}

export function useGetSiteSetting(id) {
  const url = id ? `${endpoints.list}/${id}` : null;
  const { data, isLoading, error } = useSWR(url, siteSettingsFetcher);

  return useMemo(() => ({ siteSetting: data, siteSettingLoading: isLoading, siteSettingError: error }), [data, isLoading, error]);
}

export async function getSiteSettings(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}

export async function getSiteSettingById(id) {
  const res = await axiosServices.get(`${endpoints.list}/${id}`);
  return res.data;
}

export async function createSiteSetting(payload) {
  const res = await axiosServices.post(endpoints.list, payload);
  mutate(endpoints.list);
  return res.data;
}

export async function updateSiteSetting(id, payload) {
  const res = await axiosServices.put(`${endpoints.list}/${id}`, payload);
  // mutate(endpoints.list);
  return res.data;
}

export async function removeSiteSetting(id) {
  const res = await axiosServices.delete(`${endpoints.list}/${id}`);
  mutate(endpoints.list);
  return res.data;
}
