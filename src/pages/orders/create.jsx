import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import OrderForm from './OrderForm';
import { createOrder } from 'api/orders';

// material-ui
import { Alert } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// ==============================|| ORDER CREATE ||============================== //

export default function OrderCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);

    try {
      await createOrder(values);
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Failed to create order');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title={<FormattedMessage id="create-order" />}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <OrderForm onSubmit={handleSubmit} isLoading={loading} />
    </MainCard>
  );
}
