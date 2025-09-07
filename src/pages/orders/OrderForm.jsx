import { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

// material-ui
import { Grid, TextField, Button, Box, Stack, Paper, Typography, MenuItem, IconButton, Divider, Autocomplete } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import { getCustomers } from 'api/customers';
import { getProducts } from 'api/products';

// icons
import { Add, Trash } from 'iconsax-reactjs';

// validation schema
const validationSchema = Yup.object({
  customer_id: Yup.number().required('Customer is required'),
  status: Yup.string().required('Status is required'),
  total_amount: Yup.number().required('Total amount is required').min(0, 'Total amount must be positive'),
  currency: Yup.string().required('Currency is required'),
  shipping_name: Yup.string().required('Shipping name is required'),
  shipping_addr: Yup.string().required('Shipping address is required'),
  shipping_city: Yup.string().required('Shipping city is required'),
  shipping_country: Yup.string().required('Shipping country is required'),
  shipping_zip: Yup.string().required('Shipping ZIP is required'),
  order_items: Yup.array().of(
    Yup.object({
      product_id: Yup.number().required('Product is required'),
      title: Yup.string().required('Title is required'),
      unit_price: Yup.number().required('Unit price is required').min(0, 'Unit price must be positive'),
      quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      total_price: Yup.number().required('Total price is required').min(0, 'Total price must be positive')
    })
  )
});

// order statuses
const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// currencies
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

// ==============================|| ORDER FORM ||============================== //

export default function OrderForm({ initialValues, onSubmit, isLoading = false }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const defaultValues = {
    customer_id: '',
    status: 'pending',
    total_amount: 0,
    currency: 'USD',
    shipping_name: '',
    shipping_addr: '',
    shipping_city: '',
    shipping_country: '',
    shipping_zip: '',
    order_items: [
      {
        product_id: '',
        title: '',
        unit_price: 0,
        quantity: 1,
        total_price: 0
      }
    ],
    ...initialValues
  };

  useEffect(() => {
    // Load customers and products
    const loadData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([getCustomers(), getProducts()]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const calculateItemTotal = (unitPrice, quantity) => {
    return (parseFloat(unitPrice) || 0) * (parseInt(quantity) || 0);
  };

  const calculateOrderTotal = (orderItems) => {
    return orderItems.reduce((total, item) => {
      return total + calculateItemTotal(item.unit_price, item.quantity);
    }, 0);
  };

  return (
    <Formik initialValues={defaultValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item size={12}>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage id="customer-information" />
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.email})`}
                value={customers.find((c) => c.id === values.customer_id) || null}
                onChange={(_, newValue) => {
                  setFieldValue('customer_id', newValue?.id || '');
                  if (newValue) {
                    setFieldValue('shipping_name', `${newValue.first_name} ${newValue.last_name}`);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={<FormattedMessage id="customer" />}
                    error={touched.customer_id && Boolean(errors.customer_id)}
                    helperText={touched.customer_id && errors.customer_id}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                name="status"
                label={<FormattedMessage id="status" />}
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Shipping Information */}
            <Grid item size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <FormattedMessage id="shipping-information" />
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="shipping_name"
                label={<FormattedMessage id="shipping-name" />}
                value={values.shipping_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.shipping_name && Boolean(errors.shipping_name)}
                helperText={touched.shipping_name && errors.shipping_name}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="shipping_addr"
                label={<FormattedMessage id="shipping-address" />}
                value={values.shipping_addr}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.shipping_addr && Boolean(errors.shipping_addr)}
                helperText={touched.shipping_addr && errors.shipping_addr}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                name="shipping_city"
                label={<FormattedMessage id="shipping-city" />}
                value={values.shipping_city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.shipping_city && Boolean(errors.shipping_city)}
                helperText={touched.shipping_city && errors.shipping_city}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                name="shipping_country"
                label={<FormattedMessage id="shipping-country" />}
                value={values.shipping_country}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.shipping_country && Boolean(errors.shipping_country)}
                helperText={touched.shipping_country && errors.shipping_country}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                name="shipping_zip"
                label={<FormattedMessage id="shipping-zip" />}
                value={values.shipping_zip}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.shipping_zip && Boolean(errors.shipping_zip)}
                helperText={touched.shipping_zip && errors.shipping_zip}
              />
            </Grid>

            {/* Order Items */}
            <Grid item size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <FormattedMessage id="order-items" />
              </Typography>
            </Grid>

            <Grid item size={12}>
              <FieldArray name="order_items">
                {({ push, remove }) => (
                  <Stack spacing={2}>
                    {values.order_items.map((item, index) => {
                      const itemErrors = errors.order_items?.[index];
                      const itemTouched = touched.order_items?.[index];

                      return (
                        <Paper key={index} sx={{ p: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item size={{ xs: 12, md: 3 }}>
                              <Autocomplete
                                options={products}
                                getOptionLabel={(option) => option.title}
                                value={products.find((p) => p.id === item.product_id) || null}
                                onChange={(_, newValue) => {
                                  setFieldValue(`order_items.${index}.product_id`, newValue?.id || '');
                                  setFieldValue(`order_items.${index}.title`, newValue?.title || '');
                                  setFieldValue(`order_items.${index}.unit_price`, newValue?.price || 0);
                                  setFieldValue(
                                    `order_items.${index}.total_price`,
                                    calculateItemTotal(newValue?.price || 0, item.quantity)
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={<FormattedMessage id="product" />}
                                    error={itemTouched?.product_id && Boolean(itemErrors?.product_id)}
                                    helperText={itemTouched?.product_id && itemErrors?.product_id}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item size={{ xs: 12, md: 2 }}>
                              <TextField
                                fullWidth
                                type="number"
                                name={`order_items.${index}.unit_price`}
                                label={<FormattedMessage id="unit-price" />}
                                value={item.unit_price}
                                onChange={(e) => {
                                  handleChange(e);
                                  setFieldValue(`order_items.${index}.total_price`, calculateItemTotal(e.target.value, item.quantity));
                                }}
                                onBlur={handleBlur}
                                error={itemTouched?.unit_price && Boolean(itemErrors?.unit_price)}
                                helperText={itemTouched?.unit_price && itemErrors?.unit_price}
                                inputProps={{ step: '0.01', min: '0' }}
                              />
                            </Grid>

                            <Grid item size={{ xs: 12, md: 2 }}>
                              <TextField
                                fullWidth
                                type="number"
                                name={`order_items.${index}.quantity`}
                                label={<FormattedMessage id="quantity" />}
                                value={item.quantity}
                                onChange={(e) => {
                                  handleChange(e);
                                  setFieldValue(`order_items.${index}.total_price`, calculateItemTotal(item.unit_price, e.target.value));
                                }}
                                onBlur={handleBlur}
                                error={itemTouched?.quantity && Boolean(itemErrors?.quantity)}
                                helperText={itemTouched?.quantity && itemErrors?.quantity}
                                inputProps={{ min: '1' }}
                              />
                            </Grid>

                            <Grid item size={{ xs: 12, md: 2 }}>
                              <TextField
                                fullWidth
                                type="number"
                                name={`order_items.${index}.total_price`}
                                label={<FormattedMessage id="total-price" />}
                                value={item.total_price}
                                InputProps={{ readOnly: true }}
                                inputProps={{ step: '0.01', min: '0' }}
                              />
                            </Grid>

                            <Grid item size={{ xs: 12, md: 3 }}>
                              <Stack direction="row" spacing={1}>
                                {index === values.order_items.length - 1 && (
                                  <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={() =>
                                      push({
                                        product_id: '',
                                        title: '',
                                        unit_price: 0,
                                        quantity: 1,
                                        total_price: 0
                                      })
                                    }
                                  >
                                    <FormattedMessage id="add-item" />
                                  </Button>
                                )}
                                {values.order_items.length > 1 && (
                                  <IconButton color="error" onClick={() => remove(index)}>
                                    <Trash />
                                  </IconButton>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        </Paper>
                      );
                    })}
                  </Stack>
                )}
              </FieldArray>
            </Grid>

            {/* Order Total */}
            <Grid item size={12}>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    select
                    name="currency"
                    label={<FormattedMessage id="currency" />}
                    value={values.currency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.currency && Boolean(errors.currency)}
                    helperText={touched.currency && errors.currency}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    type="number"
                    name="total_amount"
                    label={<FormattedMessage id="total-amount" />}
                    value={calculateOrderTotal(values.order_items)}
                    onChange={(e) => {
                      setFieldValue('total_amount', e.target.value);
                    }}
                    onBlur={handleBlur}
                    error={touched.total_amount && Boolean(errors.total_amount)}
                    helperText={touched.total_amount && errors.total_amount}
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item size={12}>
              <Box display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button type="button" variant="outlined">
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? <FormattedMessage id="saving" /> : <FormattedMessage id="save-order" />}
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
