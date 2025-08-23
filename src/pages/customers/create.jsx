import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import CustomerForm from './CustomerForm';
import { createCustomer } from 'api/customers';

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
      await createCustomer(values);
      navigate('/customers');
    } catch (err) {
      setError(err.message || 'Failed to create customer');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title={<FormattedMessage id="create-customer" />}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomerForm onSubmit={handleSubmit} isLoading={loading} />
    </MainCard>
  );
}
