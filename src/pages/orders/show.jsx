import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import { getOrderById, removeOrder, resendOrderEmail } from 'api/orders';
import { openSnackbar } from 'store/snackbar';

// icons
import { Edit, Trash, ArrowLeft, Check } from 'iconsax-reactjs';

// ==============================|| ORDER SHOW ||============================== //

export default function OrderShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/orders/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setDeleting(true);
      try {
        await removeOrder(id);
        navigate('/orders');
      } catch (err) {
        setError(err);
        setDeleting(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/orders');
  };

  const handleResendEmail = async (orderId) => {
    try {
      const res = await resendOrderEmail(orderId);
      // alert(res.message);
      openSnackbar({
        open: true,
        message: res.message,
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Error resending email');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading order: {error?.message || 'Order not found'}
      </Alert>
    );
  }

  return (
    <MainCard
      title={<FormattedMessage id="order-details" />}
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
          {order.status === 'paid' && (
            <Button variant="outlined" color="success" startIcon={<Check />} onClick={() => handleResendEmail(order.id)}>
              <FormattedMessage id="resend-email" />
            </Button>
          )}
        </Stack>
      }
    >
      <Grid container spacing={3}>
        {/* Order Information */}
        <Grid item size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <FormattedMessage id="order-id" />: #{order.id}
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <FormattedMessage id="status" />
                  </Typography>
                  <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                </Grid>

                <Grid item size={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <FormattedMessage id="total-amount" />
                  </Typography>
                  <Typography variant="h6">
                    {order.total} {order.currency}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                <FormattedMessage id="shipping-information" />
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <FormattedMessage id="shipping-name" />
                  </Typography>
                  <Typography variant="body1">{order.shipping_name}</Typography>
                </Grid>

                <Grid item size={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <FormattedMessage id="shipping-address" />
                  </Typography>
                  <Typography variant="body1">{order.shipping_addr}</Typography>
                </Grid>

                <Grid item size={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <FormattedMessage id="shipping-city" />
                  </Typography>
                  <Typography variant="body1">{order.shipping_city}</Typography>
                </Grid>

                <Grid item size={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <FormattedMessage id="shipping-country" />
                  </Typography>
                  <Typography variant="body1">{order.shipping_country}</Typography>
                </Grid>

                <Grid item size={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <FormattedMessage id="shipping-zip" />
                  </Typography>
                  <Typography variant="body1">{order.shipping_zip}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Information */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage id="customer-information" />
              </Typography>

              {order.customer && (
                <Stack spacing={1}>
                  <Typography variant="body1">
                    {order.customer.first_name} {order.customer.last_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {order.customer.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {order.customer.phone}
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {/* <FormattedMessage id="customer-information" /> */}
                Payment Information
              </Typography>

              {order?.payments?.map((payment) => (
                <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center" key={payment.id} sx={{ mb: 1 }}>
                  <Typography variant="body1">{payment.reference}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {payment.status}
                  </Typography>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items */}
        <Grid item size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage id="order-items" />
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <FormattedMessage id="product" />
                      </TableCell>
                      <TableCell align="right">
                        <FormattedMessage id="unit-price" />
                      </TableCell>
                      <TableCell align="right">
                        <FormattedMessage id="quantity" />
                      </TableCell>
                      <TableCell align="right">
                        <FormattedMessage id="total-price" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.order_items && order.order_items.length > 0 ? (
                      order.order_items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="subtitle1">{item.title}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            {item.unit_price} {order.currency}
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">
                              {item.total_price} {order.currency}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No items found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainCard>
  );
}
