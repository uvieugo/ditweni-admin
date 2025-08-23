/* eslint-disable no-unused-vars */
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
  Alert,
  Avatar
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';

// icons
import { Add, Edit, Eye, Trash } from 'iconsax-reactjs';
import { useGetProductCategories } from '../../api/product-categories';

// ==============================|| PRODUCTS LIST ||============================== //

export default function ProductsList() {
  const navigate = useNavigate();
  const { productCategories, productCategoriesLoading, productCategoriesError } = useGetProductCategories();

  const handleCreate = () => {
    navigate('/product-categories/create');
  };

  // const handleView = (id) => {
  //   navigate(`/product-categories/${id}`);
  // };

  const handleEdit = (id) => {
    navigate(`/product-categories/${id}/edit`);
  };

  if (productCategoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (productCategoriesError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading product categories: {productCategoriesError.message}
      </Alert>
    );
  }

  return (
    <MainCard
      title={<FormattedMessage id="product-categories" />}
      secondary={
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="add-product-category" />
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
                <FormattedMessage id="description" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productCategories.length > 0 ? (
              productCategories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        variant="rounded"
                        alt={category.name}
                        src={category.image_url ? category.image_url : '/assets/images/products/no-image.png'}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Stack>
                        <Typography variant="subtitle1">{category.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {category.description?.substring(0, 50)}...
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={0} justifyContent="center">
                      {/* <IconButton size="small" onClick={() => handleView(category.id)}>
                        <Eye size="16" />
                      </IconButton> */}
                      <IconButton size="small" onClick={() => handleEdit(category.id)}>
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
                    No product categories found
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
