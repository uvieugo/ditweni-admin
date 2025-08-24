import useSWR, { mutate } from 'swr';
import axiosServices, { fetcher } from '../utils/axios';
import { useMemo } from 'react';

const endpoints = {
  key: 'api/products',
  list: 'api/v1/admin/license_types'
};

export const licenseTypesFetcher = (url, config) => fetcher([url, config]);

export function useGetLicenseTypes(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const { data, isLoading, error } = useSWR(url, licenseTypesFetcher);

  return useMemo(() => ({ licenseTypes: data || [], licenseTypesLoading: isLoading, licenseTypesError: error }), [data, isLoading, error]);
}

export function useGetLicenseType(id) {
  const url = id ? `${endpoints.list}/${id}` : null;
  const { data, isLoading, error } = useSWR(url, licenseTypesFetcher);

  return useMemo(() => ({ licenseType: data, licenseTypeLoading: isLoading, licenseTypeError: error }), [data, isLoading, error]);
}

export async function getLicenseTypes(params = '') {
  const url = `${endpoints.list}${params ? `?${params}` : ''}`;
  const res = await axiosServices.get(url);
  return res.data;
}
