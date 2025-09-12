import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import PaymentMethodForm from './Form';
import { getPaymentMethodById, updatePaymentMethod } from 'api/payment-methods';

// material-ui
import { Alert, CircularProgress, Box } from '@mui/material';

// ==============================|| PAYMENT METHOD EDIT ||============================== //

export default function PaymentMethodEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPaymentMethod = async () => {
      try {
        const data = await getPaymentMethodById(id);
        setPaymentMethod(data);
      } catch (err) {
        setError(err.message || 'Failed to load payment method');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPaymentMethod();
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSaving(true);
    setError(null);

    try {
      await updatePaymentMethod(id, values);
      navigate('/payment-methods');
    } catch (err) {
      setError(err.message || 'Failed to update payment method');
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

  if (error && !paymentMethod) {
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

      <PaymentMethodForm initialValues={paymentMethod} onSubmit={handleSubmit} isLoading={saving} />
    </MainCard>
  );
}
