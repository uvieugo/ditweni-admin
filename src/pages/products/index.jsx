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
  Alert,
  Avatar
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import { useGetProducts } from 'api/products';

// icons
import { Add, Edit, Eye, Trash } from 'iconsax-reactjs';

// ==============================|| PRODUCTS LIST ||============================== //

export default function ProductsList() {
  const navigate = useNavigate();
  const { products, productsLoading, productsError } = useGetProducts();

  const handleCreate = () => {
    navigate('/products/create');
  };

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/products/${id}/edit`);
  };

  if (productsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (productsError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading products: {productsError.message}
      </Alert>
    );
  }

  return (
    <MainCard
      title={<FormattedMessage id="products" />}
      secondary={
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="add-product" />
        </Button>
      }
    >
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="product" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="category" />
              </TableCell>
              {/* <TableCell>
                <FormattedMessage id="price" />
              </TableCell> */}
              <TableCell align="center">
                <FormattedMessage id="featured" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="status" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={product?.image_url} alt={product.title} sx={{ width: 48, height: 48 }} variant="rounded">
                        {product.title?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1">{product.title}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {product.description?.substring(0, 50)}...
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  {/* <TableCell>
                    {product.price} {product.currency}
                  </TableCell> */}
                  <TableCell align="center">
                    <Chip
                      label={product.featured ? <FormattedMessage id="yes" /> : <FormattedMessage id="no" />}
                      color={product.featured ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.active ? <FormattedMessage id="active" /> : <FormattedMessage id="inactive" />}
                      color={product.active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0} justifyContent="center">
                      {/* <IconButton size="small" onClick={() => handleView(product.id)}>
                        <Eye size="16" />
                      </IconButton> */}
                      <IconButton size="small" onClick={() => handleEdit(product.id)}>
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
                    No products found
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
