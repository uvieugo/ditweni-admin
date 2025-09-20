import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, Alert, LinearProgress, Chip, IconButton, Stack, Divider } from '@mui/material';
// import { Upload, Download, Trash2, File } from 'lucide-react';
import { DocumentUpload, DocumentDownload, Document, Trash } from 'iconsax-reactjs';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import {
  getProductDownloadsAdmin,
  getCloudinarySignature,
  createProductDownload,
  getSignedProductDownloadUrl,
  deleteProductDownload
} from 'api/productDownloads';

// ==============================|| ADMIN PRODUCT DOWNLOADS MANAGER ||============================== //

export default function AdminProductDownloads({ product, onDownloadsChange }) {
  const [downloads, setDownloads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [cloudinarySignature, setCloudinarySignature] = useState(null);

  const usesLicenses = product?.category?.uses_licenses || false;
  const licenseTypes = product?.license_types || [];

  // Fetch existing downloads
  const fetchDownloads = useCallback(async () => {
    try {
      // const response = await axios.get(`/api/v1/admin/products/${product.id}/downloads`);
      const response = await getProductDownloadsAdmin(product.id);
      setDownloads(response);
    } catch (err) {
      console.error('Failed to fetch downloads:', err);
      setDownloads([]);
      setError('Failed to load downloads');
    }
  }, [product.id]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  // Get Cloudinary upload signature from Rails
  // const getUploadSignature = async () => {
  //   try {
  //     const response = await getCloudinarySignature(product.id);
  //     setCloudinarySignature(response);
  //     return response;
  //   } catch (err) {
  //     console.error('Failed to get upload signature:', err);
  //     throw new Error('Failed to get upload signature');
  //   }
  // };

  // // Upload file to Cloudinary
  // const uploadToCloudinary = async (file, licenseType = null) => {
  //   const signature = cloudinarySignature || (await getUploadSignature());

  //   // const publicId = licenseType ? `${product.id}_${licenseType.toLowerCase()}_${Date.now()}` : null;
  //   // const publicId = signature.public_id || null;

  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('api_key', signature.api_key);
  //   formData.append('timestamp', signature.timestamp);
  //   formData.append('public_id', signature.public_id);
  //   // formData.append('folder', signature.folder);
  //   formData.append('resource_type', signature.resource_type);
  //   formData.append('signature', signature.signature);

  //   // formData.append('asset_folder', signature.asset_folder);

  //   // if (publicId) {
  //   //   formData.append('public_id', publicId);
  //   // }

  //   // Add signature LAST

  //   const uploadKey = licenseType || 'single';
  //   setUploadProgress((prev) => ({ ...prev, [uploadKey]: 0 }));

  //   try {
  //     const response = await axios.post(`https://api.cloudinary.com/v1_1/${signature.cloud_name}/auto/upload`, formData, {
  //       onUploadProgress: (progressEvent) => {
  //         const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  //         setUploadProgress((prev) => ({ ...prev, [uploadKey]: progress }));
  //       }
  //     });
  //     console.log('Cloudinary upload response:', response.data);
  //     return response.data.secure_url;
  //   } finally {
  //     setUploadProgress((prev) => ({ ...prev, [uploadKey]: undefined }));
  //   }
  // };

  // // Save download to backend
  // const saveDownload = async (url, licenseTypeId = null) => {
  //   const payload = {
  //     product_id: product.id,
  //     url,
  //     ...(licenseTypeId && { license_type_id: licenseTypeId })
  //   };

  //   const response = await createProductDownload(payload);
  //   return response.data;
  // };

  // Handle file upload
  const handleFileUpload = async (file, licenseType = null) => {
    setUploading(true);
    setError(null);

    try {
      // Upload to Cloudinary
      // const url = await uploadToCloudinary(file, licenseType?.name);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('product_id', product.id);
      formData.append('license_type_id', licenseType?.id);

      // Save to backend
      // await saveDownload(url, licenseType?.id);
      // await saveDownload(formData);
      const response = await createProductDownload(formData);
      // return response.data;
      console.log('Created download:', response.data);

      // Refresh downloads
      await fetchDownloads();
      onDownloadsChange?.();
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (licenseType = null) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip,.rar,.7z,.wav,.mp3,.aif,.flp,.als'; // Common audio/project formats
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file, licenseType);
      }
    };
    input.click();
  };

  // Delete download
  const handleDelete = async (downloadId) => {
    try {
      // await axios.delete(`/api/v1/admin/product_downloads/${downloadId}`);
      await deleteProductDownload(downloadId);
      await fetchDownloads();
      onDownloadsChange?.();
    } catch (err) {
      console.error('Failed to delete download:', err);
      setError('Failed to delete download');
    }
  };

  // Get downloads for a specific license type
  const getDownloadsForLicense = (licenseTypeId) => {
    return downloads.filter((d) => d.license_type_id === licenseTypeId);
  };

  // Get downloads without license (for merch)
  const getSingleDownloads = () => {
    return downloads.filter((d) => !d.license_type_id);
  };

  const isUploading = (licenseType = null) => {
    const key = licenseType || 'single';
    return uploadProgress[key] !== undefined;
  };

  const getUploadProgress = (licenseType = null) => {
    const key = licenseType || 'single';
    return uploadProgress[key] || 0;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="product-downloads" defaultMessage="Product Downloads" />
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {usesLicenses ? (
          // License-based downloads
          <Grid container spacing={3}>
            {licenseTypes.map((licenseType) => {
              const licenseDownloads = getDownloadsForLicense(licenseType.id);
              const uploading = isUploading(licenseType.name);

              return (
                <Grid item size={{ xs: 12, md: 6 }} key={licenseType.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="subtitle1">{licenseType.name} License</Typography>
                        <Chip
                          label={`${licenseDownloads.length} file${licenseDownloads.length !== 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      {/* Upload Button */}
                      <Button
                        variant="outlined"
                        startIcon={<DocumentUpload size={16} />}
                        onClick={() => handleFileSelect(licenseType)}
                        disabled={uploading}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        Upload {licenseType.name} File
                      </Button>

                      {/* Upload Progress */}
                      {uploading && (
                        <Box sx={{ mb: 2 }}>
                          <LinearProgress variant="determinate" value={getUploadProgress(licenseType.name)} />
                          <Typography variant="caption" color="textSecondary">
                            Uploading... {getUploadProgress(licenseType.name)}%
                          </Typography>
                        </Box>
                      )}

                      {/* Existing Downloads */}
                      <Stack spacing={1}>
                        {licenseDownloads.map((download) => (
                          <Box
                            key={download.id}
                            display="flex"
                            alignItems="center"
                            p={1}
                            border={1}
                            borderColor="grey.300"
                            borderRadius={1}
                          >
                            <Document size={16} style={{ marginRight: 8 }} />
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                              {download.filename || 'Download File'}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={async () => {
                                // const download_data = await getSignedProductDownloadUrl(download.id);
                                // console.log(download_data);
                                window.open(download.signed_url, '_blank');
                              }}
                              title="Download"
                            >
                              <DocumentDownload size={16} />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(download.id)} title="Delete">
                              <Trash size={16} />
                            </IconButton>
                          </Box>
                        ))}
                        {licenseDownloads.length === 0 && (
                          <Typography variant="caption" color="textSecondary" textAlign="center">
                            No downloads available
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          // Single download for non-licensed products (Merch)
          <Box>
            <Button
              variant="outlined"
              startIcon={<DocumentUpload size={16} />}
              onClick={() => handleFileSelect()}
              disabled={uploading}
              sx={{ mb: 2 }}
            >
              Upload Download File
            </Button>

            {/* Upload Progress */}
            {isUploading() && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={getUploadProgress()} />
                <Typography variant="caption" color="textSecondary">
                  Uploading... {getUploadProgress()}%
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Existing Downloads */}
            <Stack spacing={1}>
              {getSingleDownloads().map((download) => (
                <Box key={download.id} display="flex" alignItems="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                  <Document size={20} style={{ marginRight: 12 }} />
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {download.filename || 'Download File'}
                  </Typography>
                  <IconButton onClick={() => window.open(download.url, '_blank')} title="Download">
                    <DocumentDownload size={20} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(download.id)} title="Delete">
                    <Trash size={20} />
                  </IconButton>
                </Box>
              ))}
              {getSingleDownloads().length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={3}>
                  No downloads available
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
