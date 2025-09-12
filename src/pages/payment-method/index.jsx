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
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import { useGetPaymentMethods } from 'api/payment-methods';

// icons
import { Add, Edit, Eye, Trash } from 'iconsax-reactjs';

// ==============================|| PAYMENT METHODS LIST ||============================== //

export default function PaymentMethodsList() {
  const navigate = useNavigate();
  const { paymentMethods, paymentMethodsLoading, paymentMethodsError } = useGetPaymentMethods();

  const handleCreate = () => {
    navigate('/payment-methods/create');
  };

  const handleView = (id) => {
    navigate(`/payment-methods/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/payment-methods/${id}/edit`);
  };

  if (paymentMethodsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (paymentMethodsError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading payment methods: {paymentMethodsError.message}
      </Alert>
    );
  }

  return (
    <MainCard
      title={<FormattedMessage id="payment-methods" />}
      secondary={
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="add-payment-method" />
        </Button>
      }
    >
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="name" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="provider" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="active" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((paymentMethod) => (
                <TableRow key={paymentMethod.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1">{paymentMethod.name}</Typography>
                  </TableCell>
                  <TableCell>{paymentMethod.provider}</TableCell>
                  <TableCell>{paymentMethod.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0} justifyContent="center">
                      <IconButton size="small" onClick={() => handleView(paymentMethod.id)}>
                        <Eye size="16" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(paymentMethod.id)}>
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
                <TableCell colSpan={4} align="center">
                  <Typography variant="h6" color="textSecondary">
                    <FormattedMessage id="no-customers-found" />
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
