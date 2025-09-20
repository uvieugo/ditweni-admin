import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import AdminProductDownloads from 'components/AdminProductDownloads';
import ProductDownloads from 'components/ProductDownloads';

// Example integration component showing how to use the download components
export default function ProductPageWithDownloads({ productId, isAdmin = false, currentUser = null }) {
  const [product, setProduct] = useState(null);
  const [userPurchases, setUserPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Fetch product data
    fetchProduct();

    if (!isAdmin && currentUser) {
      // Fetch user's purchases for this product
      fetchUserPurchases();
    }
  }, [productId, currentUser, isAdmin]);

  const fetchProduct = async () => {
    try {
      // Replace with your actual product API call
      const response = await fetch(`/api/v1/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const fetchUserPurchases = async () => {
    try {
      // Replace with your actual purchases API call
      const response = await fetch(`/api/v1/users/${currentUser.id}/purchases?product_id=${productId}`);
      const data = await response.json();
      setUserPurchases(data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    }
  };

  const handleDownloadsChange = () => {
    // Callback when downloads are updated (for admin)
    console.log('Downloads updated');
  };

  if (!product) {
    return <Typography>Loading product...</Typography>;
  }

  return (
    <Box>
      {/* Product Info */}
      <Typography variant="h4" gutterBottom>
        {product.title}
      </Typography>

      {isAdmin ? (
        // Admin view with tabs
        <Box>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Product Details" />
            <Tab label="Downloads Manager" />
          </Tabs>

          <Box mt={3}>
            {activeTab === 0 && <Typography>Product details and other admin content...</Typography>}

            {activeTab === 1 && <AdminProductDownloads product={product} onDownloadsChange={handleDownloadsChange} />}
          </Box>
        </Box>
      ) : (
        // Customer view
        <Box mt={3}>
          <ProductDownloads product={product} userPurchases={userPurchases} />
        </Box>
      )}
    </Box>
  );
}

// Backend Rails API endpoints you need to implement:
/*

1. GET /api/v1/admin/products/:id/downloads
   - Returns array of downloads for admin view
   - Response: [{ id, filename, url, license_type_id, created_at }]

2. POST /api/v1/admin/product_downloads
   - Creates a new download
   - Body: { product_id, url, license_type_id? }
   - Response: { id, filename, url, license_type_id, created_at }

3. DELETE /api/v1/admin/product_downloads/:id
   - Deletes a download
   - Response: { success: true }

4. GET /api/v1/admin/cloudinary/signature
   - Returns Cloudinary upload signature
   - Response: { api_key, timestamp, signature, cloud_name }

5. GET /api/v1/products/:id/downloads
   - Returns public downloads for customer view
   - Response: [{ id, filename, license_type_id }] (no URL for security)

6. GET /api/v1/users/:id/purchases?product_id=:product_id
   - Returns user's purchases for the product
   - Response: [{ id, product_id, license_type_id, status, created_at }]

*/
