import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import Form from './Form';

// material-ui
import { Alert } from '@mui/material';
import { createProductCategory } from '../../api/product-categories';

// ==============================|| PRODUCT CREATE ||============================== //

export default function ProductCategoryCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);
    console.log(values);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('image', values.imageFile);
    // values.imageFile && delete values.imageFile;
    // values.imageFile = formData.get('image');
    // formData.append('product_category', JSON.stringify(values));
    // console.log(formData);

    try {
      await createProductCategory(formData);
      navigate('/product-categories');
    } catch (err) {
      setError(err.message || 'Failed to create product category');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="Create Product Category">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} isLoading={loading} />
    </MainCard>
  );
}
