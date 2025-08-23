import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import { Box, Button, Card, CardContent, Typography, Grid, Stack, CircularProgress, Alert, Divider } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import { getCustomerById, removeCustomer } from 'api/customers';

// icons
import { Edit, Trash, ArrowLeft } from 'iconsax-reactjs';

// ==============================|| CUSTOMER SHOW ||============================== //

export default function CustomerShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await getCustomerById(id);
        setCustomer(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCustomer();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/customers/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setDeleting(true);
      try {
        await removeCustomer(id);
        navigate('/customers');
      } catch (err) {
        setError(err);
        setDeleting(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/customers');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading customer: {error?.message || 'Customer not found'}
      </Alert>
    );
  }

  return (
    <MainCard
      title={<FormattedMessage id="customer-details" />}
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowLeft />} onClick={handleBack}>
            <FormattedMessage id="back" />
          </Button>
          <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>
            <FormattedMessage id="edit" />
          </Button>
          <Button variant="outlined" color="error" startIcon={<Trash />} onClick={handleDelete} disabled={deleting}>
            {deleting ? <FormattedMessage id="deleting" /> : <FormattedMessage id="delete" />}
          </Button>
        </Stack>
      }
    >
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {customer.first_name} {customer.last_name}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                <FormattedMessage id="first-name" />
              </Typography>
              <Typography variant="body1">{customer.first_name}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                <FormattedMessage id="last-name" />
              </Typography>
              <Typography variant="body1">{customer.last_name}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                <FormattedMessage id="email" />
              </Typography>
              <Typography variant="body1">{customer.email}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                <FormattedMessage id="phone" />
              </Typography>
              <Typography variant="body1">{customer.phone}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </MainCard>
  );
}
