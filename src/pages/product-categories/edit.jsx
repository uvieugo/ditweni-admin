import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import ProductForm from './Form';
import { getProductCategoryById, updateProductCategory } from 'api/product-categories';

// material-ui
import { Alert, CircularProgress, Box } from '@mui/material';

// ==============================|| PRODUCT EDIT ||============================== //

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productCategory, setProductCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductCategoryById(id);
        setProductCategory(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSaving(true);
    setError(null);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('image', values.imageFile);

    try {
      await updateProductCategory(id, formData);
      navigate('/product-categories');
    } catch (err) {
      setError(err.message || 'Failed to update product');
      setSubmitting(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !productCategory) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <MainCard title="Edit Product">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ProductForm initialValues={productCategory} onSubmit={handleSubmit} isLoading={saving} />
    </MainCard>
  );
}
