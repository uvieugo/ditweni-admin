import { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, Alert } from '@mui/material';
import { Download, Lock, File } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';

// ==============================|| PRODUCT DOWNLOADS DISPLAY ||============================== //

export default function ProductDownloads({ product, userPurchases = [] }) {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usesLicenses = product?.category?.uses_licenses || false;
  const licenseTypes = product?.category?.license_types || [];

  const fetchDownloads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/products/${product.id}/downloads`);
      setDownloads(response.data);
    } catch (err) {
      console.error('Failed to fetch downloads:', err);
      setError('Failed to load downloads');
    } finally {
      setLoading(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  // Check if user has purchased a specific license
  const hasPurchasedLicense = (licenseTypeId) => {
    return userPurchases.some((purchase) => purchase.license_type_id === licenseTypeId && purchase.status === 'completed');
  };

  // Check if user has purchased the product (for non-licensed items)
  const hasPurchasedProduct = () => {
    return userPurchases.some((purchase) => purchase.product_id === product.id && purchase.status === 'completed');
  };

  // Get downloads for a specific license type
  const getDownloadsForLicense = (licenseTypeId) => {
    return downloads.filter((d) => d.license_type_id === licenseTypeId);
  };

  // Get downloads without license (for merch)
  const getSingleDownloads = () => {
    return downloads.filter((d) => !d.license_type_id);
  };

  // Handle download with purchase verification
  const handleDownload = async (downloadUrl, licenseTypeId = null) => {
    try {
      // For licensed products, check license purchase
      if (licenseTypeId && !hasPurchasedLicense(licenseTypeId)) {
        alert('You need to purchase this license to download the file.');
        return;
      }

      // For non-licensed products, check product purchase
      if (!licenseTypeId && !hasPurchasedProduct()) {
        alert('You need to purchase this product to download the file.');
        return;
      }

      // Open download URL (backend should provide signed URL for security)
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading downloads...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="downloads" defaultMessage="Downloads" />
        </Typography>

        {usesLicenses ? (
          // License-based downloads
          <Stack spacing={3}>
            {licenseTypes.map((licenseType) => {
              const licenseDownloads = getDownloadsForLicense(licenseType.id);
              const hasPurchased = hasPurchasedLicense(licenseType.id);

              return (
                <Box key={licenseType.id}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Typography variant="subtitle1">{licenseType.name} License</Typography>
                    <Chip label={hasPurchased ? 'Purchased' : 'Not Purchased'} color={hasPurchased ? 'success' : 'default'} size="small" />
                    {!hasPurchased && <Lock size={16} color="#666" />}
                  </Stack>

                  <Stack spacing={1}>
                    {licenseDownloads.length > 0 ? (
                      licenseDownloads.map((download) => (
                        <Box
                          key={download.id}
                          display="flex"
                          alignItems="center"
                          p={2}
                          border={1}
                          borderColor={hasPurchased ? 'success.light' : 'grey.300'}
                          borderRadius={1}
                          bgcolor={hasPurchased ? 'success.50' : 'grey.50'}
                        >
                          <File size={20} style={{ marginRight: 12 }} />
                          <Typography variant="body1" sx={{ flexGrow: 1 }}>
                            {download.filename || `${licenseType.name} Download`}
                          </Typography>
                          <Button
                            variant={hasPurchased ? 'contained' : 'outlined'}
                            startIcon={hasPurchased ? <Download size={16} /> : <Lock size={16} />}
                            onClick={() => handleDownload(download.url, licenseType.id)}
                            disabled={!hasPurchased}
                            color={hasPurchased ? 'primary' : 'inherit'}
                          >
                            {hasPurchased ? 'Download' : 'Purchase Required'}
                          </Button>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                        No downloads available for {licenseType.name} license
                      </Typography>
                    )}
                  </Stack>

                  {licenseType.id !== licenseTypes[licenseTypes.length - 1].id && <Divider sx={{ mt: 2 }} />}
                </Box>
              );
            })}
          </Stack>
        ) : (
          // Single download for non-licensed products (Merch)
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Typography variant="subtitle1">Product Downloads</Typography>
              <Chip
                label={hasPurchasedProduct() ? 'Purchased' : 'Not Purchased'}
                color={hasPurchasedProduct() ? 'success' : 'default'}
                size="small"
              />
              {!hasPurchasedProduct() && <Lock size={16} color="#666" />}
            </Stack>

            <Stack spacing={1}>
              {getSingleDownloads().length > 0 ? (
                getSingleDownloads().map((download) => (
                  <Box
                    key={download.id}
                    display="flex"
                    alignItems="center"
                    p={2}
                    border={1}
                    borderColor={hasPurchasedProduct() ? 'success.light' : 'grey.300'}
                    borderRadius={1}
                    bgcolor={hasPurchasedProduct() ? 'success.50' : 'grey.50'}
                  >
                    <File size={20} style={{ marginRight: 12 }} />
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {download.filename || 'Product Download'}
                    </Typography>
                    <Button
                      variant={hasPurchasedProduct() ? 'contained' : 'outlined'}
                      startIcon={hasPurchasedProduct() ? <Download size={16} /> : <Lock size={16} />}
                      onClick={() => handleDownload(download.url)}
                      disabled={!hasPurchasedProduct()}
                      color={hasPurchasedProduct() ? 'primary' : 'inherit'}
                    >
                      {hasPurchasedProduct() ? 'Download' : 'Purchase Required'}
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={3}>
                  No downloads available for this product
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {downloads.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body2" color="textSecondary">
              <FormattedMessage id="no-downloads-available" defaultMessage="No downloads available" />
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
