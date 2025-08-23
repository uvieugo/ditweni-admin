import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import ProductForm from './ProductForm';
import { createProduct } from 'api/products';
import { getProductCategories } from '../../api/product-categories';

// material-ui
import { Alert } from '@mui/material';

// ==============================|| PRODUCT CREATE ||============================== //

export default function ProductCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const categories = await getProductCategories();
        setProductCategories(categories);
      } catch (err) {
        setError(err.message || 'Failed to fetch product categories');
      }
    };

    fetchProductCategories();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('product_category_id', values.product_category_id);
    formData.append('price', values.price);
    formData.append('currency', values.currency);
    formData.append('featured', values.featured);
    formData.append('active', values.active);
    formData.append('image', values.imageFile);

    try {
      await createProduct(formData);
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to create product');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="Create Product">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ProductForm onSubmit={handleSubmit} isLoading={loading} productCategories={productCategories} />
    </MainCard>
  );
}
