import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import { Box, Button, Card, CardContent, Typography, Grid, Chip, Stack, CircularProgress, Alert, Divider } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { getProductById, removeProduct } from 'api/products';

// icons
import { Edit, Trash, ArrowLeft } from 'iconsax-reactjs';

// ==============================|| PRODUCT SHOW ||============================== //

export default function ProductShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeleting(true);
      try {
        await removeProduct(id);
        navigate('/products');
      } catch (err) {
        setError(err);
        setDeleting(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading product: {error?.message || 'Product not found'}
      </Alert>
    );
  }

  return (
    <MainCard
      title="Product Details"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowLeft />} onClick={handleBack}>
            Back
          </Button>
          <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<Trash />} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Stack>
      }
    >
      <Grid container spacing={3}>
        {/* Product Image */}
        {product.image && (
          <Grid item xs={12}>
            <Card>
              <Box
                component="img"
                src={product.image}
                alt={product.title}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 1
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {product.title}
              </Typography>

              <Typography variant="body1" color="textSecondary" paragraph>
                {product.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{product.category}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Price
                  </Typography>
                  <Typography variant="h6">
                    {product.price} {product.currency}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Active Status
                  </Typography>
                  <Chip label={product.active ? 'Active' : 'Inactive'} color={product.active ? 'success' : 'error'} size="small" />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Featured
                  </Typography>
                  <Chip label={product.featured ? 'Yes' : 'No'} color={product.featured ? 'primary' : 'default'} size="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainCard>
  );
}
