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
import { useGetCustomers } from 'api/customers';

// icons
import { Add, Edit, Eye, Trash } from 'iconsax-reactjs';

// ==============================|| CUSTOMERS LIST ||============================== //

export default function CustomersList() {
  const navigate = useNavigate();
  const { customers, customersLoading, customersError } = useGetCustomers();

  const handleCreate = () => {
    navigate('/customers/create');
  };

  const handleView = (id) => {
    navigate(`/customers/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/customers/${id}/edit`);
  };

  if (customersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (customersError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading customers: {customersError.message}
      </Alert>
    );
  }

  return (
    <MainCard
      title={<FormattedMessage id="customers" />}
      secondary={
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="add-customer" />
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
                <FormattedMessage id="email" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="phone" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {customer.first_name} {customer.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0} justifyContent="center">
                      <IconButton size="small" onClick={() => handleView(customer.id)}>
                        <Eye size="16" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(customer.id)}>
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
