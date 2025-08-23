import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import { useGetOrders } from 'api/orders';

// icons
import { Add, Edit, Eye, Trash } from 'iconsax-reactjs';

// ==============================|| ORDERS LIST ||============================== //

export default function OrdersList() {
  const navigate = useNavigate();
  const { orders, ordersLoading, ordersError } = useGetOrders();

  const handleCreate = () => {
    navigate('/orders/create');
  };

  const handleView = (id) => {
    navigate(`/orders/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/orders/${id}/edit`);
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

  if (ordersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (ordersError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading orders: {ordersError.message}
      </Alert>
    );
  }

  return (
    <MainCard
      title={<FormattedMessage id="orders" />}
      secondary={
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="add-order" />
        </Button>
      }
    >
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="order-id" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="customer" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="total-amount" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="status" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="shipping-city" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1">#{order.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{order.shipping_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">
                      {order.total_amount} {order.currency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                  </TableCell>
                  <TableCell>{order.shipping_city}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0} justifyContent="center">
                      <IconButton size="small" onClick={() => handleView(order.id)}>
                        <Eye size="16" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(order.id)}>
                        <Edit size="16" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Trash size="16" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="h6" color="textSecondary">
                    <FormattedMessage id="no-orders-found" />
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
