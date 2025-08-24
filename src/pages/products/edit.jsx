import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import ProductForm from './ProductForm';
import { getProductById, updateProduct } from 'api/products';
import { getProductCategories } from '../../api/product-categories';

// material-ui
import { Alert, CircularProgress, Box } from '@mui/material';

// ==============================|| PRODUCT EDIT ||============================== //

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
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
    console.log(values);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('product_category_id', values.product_category_id);
    // formData.append('price', values.price);
    // formData.append('currency', values.currency);
    formData.append('featured', values.featured);
    formData.append('active', values.active);
    // formData.append('product_prices_attributes', JSON.stringify(values.prices));
    values.prices.forEach((price, idx) => {
      Object.keys(price).forEach((key) => {
        formData.append(`product_prices_attributes[${idx}][${key}]`, price[key]);
      });
    });
    if (values.imageFile) {
      formData.append('image', values.imageFile);
    }
    if (values.sampleFile) {
      formData.append('sample', values.sampleFile);
    }
    // Object.keys(values).forEach((key) => {
    //   if (key === 'imageFile') {
    //     formData.append('image', values.imageFile);
    //   } else {
    //     formData.append(key, values[key]);
    //   }
    // });

    try {
      await updateProduct(id, formData);
      navigate('/products');
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

  if (error && !product) {
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

      <ProductForm initialValues={product} onSubmit={handleSubmit} isLoading={saving} productCategories={productCategories} />
    </MainCard>
  );
}
