import axiosServices from 'utils/axios';

// API endpoints
const endpoints = {
  productDownloads: '/api/v1/admin/product_downloads',
  cloudinarySignature: '/api/v1/admin/cloudinary/signature',
  productDownloadsPublic: (productId) => `/api/v1/products/${productId}/downloads`,
  productDownloadsAdmin: (productId) => `/api/v1/admin/products/${productId}/product_downloads`
};

// Admin API - Get Cloudinary upload signature
export async function getCloudinarySignature(productId = null) {
  const response = await axiosServices.get(endpoints.cloudinarySignature, { params: { product_id: productId } });
  return response.data;
}

// Admin API - Create product download
export async function createProductDownload(payload) {
  // const payload = {
  //   product_id: productId,
  //   url,
  //   ...(licenseTypeId && { license_type_id: licenseTypeId })
  // };

  const response = await axiosServices.post(endpoints.productDownloads, payload);
  return response.data;
}

// Admin API - Get product downloads (admin view)
export async function getProductDownloadsAdmin(productId) {
  const response = await axiosServices.get(endpoints.productDownloadsAdmin(productId));
  return response.data;
}

// Admin API - Delete product download
export async function deleteProductDownload(downloadId) {
  const response = await axiosServices.delete(`${endpoints.productDownloads}/${downloadId}`);
  return response.data;
}

export async function getSignedProductDownloadUrl(downloadId) {
  const response = await axiosServices.get(`${endpoints.productDownloads}/${downloadId}/url`, { params: { download_id: downloadId } });
  return response.data;
}

// Public API - Get product downloads (customer view)
export async function getProductDownloads(productId) {
  const response = await axiosServices.get(endpoints.productDownloadsPublic(productId));
  return response.data;
}

// Upload file to Cloudinary with Rails signature
export async function uploadToCloudinary(file, signature, folder = 'products', publicId = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signature.api_key);
  formData.append('timestamp', signature.timestamp);
  formData.append('signature', signature.signature);
  formData.append('folder', folder);

  if (publicId) {
    formData.append('public_id', publicId);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloud_name}/auto/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}

export default {
  getCloudinarySignature,
  createProductDownload,
  getProductDownloadsAdmin,
  deleteProductDownload,
  getProductDownloads,
  uploadToCloudinary
};
