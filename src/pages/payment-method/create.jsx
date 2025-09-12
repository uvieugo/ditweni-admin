import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import PaymentMethodForm from './Form';
import { createPaymentMethod } from 'api/payment-methods';

// material-ui
import { Alert } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// ==============================|| CUSTOMER CREATE ||============================== //

export default function CustomerCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);

    try {
      await createPaymentMethod(values);
      navigate('/payment-methods');
    } catch (err) {
      setError(err.message || 'Failed to create payment method');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title={<FormattedMessage id="create-payment-method" />}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <PaymentMethodForm onSubmit={handleSubmit} isLoading={loading} />
    </MainCard>
  );
}
