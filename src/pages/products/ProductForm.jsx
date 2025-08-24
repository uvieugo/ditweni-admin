/* eslint-disable no-unused-vars */
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Stack,
  MenuItem,
  Typography,
  IconButton,
  LinearProgress,
  Alert
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// icons
import { Camera, Trash } from 'iconsax-reactjs';

import { useGetLicenseTypes } from '../../api/license_types';

// project imports

// validation schema
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').max(255, 'Title must be 255 characters or less'),
  description: Yup.string().required('Description is required'),
  product_category_id: Yup.string().required('Category is required'),
  prices: Yup.array().of(
    Yup.object().shape({
      license_type_id: Yup.number().required(),
      ngn_amount: Yup.number().min(0, 'Price must be positive').nullable(),
      usd_amount: Yup.number().min(0, 'Price must be positive').nullable()
    })
  ),
  featured: Yup.boolean(),
  active: Yup.boolean()
});

// sample currencies - replace with your actual currencies
const currencies = ['USD', 'NGN'];
// const licenseTypes = [
//   { id: 1, name: 'Standard' },
//   { id: 2, name: 'Premium' }
// ];

// ==============================|| PRODUCT FORM ||============================== //

export default function ProductForm({ initialValues, onSubmit, isLoading = false, productCategories }) {
  const navigate = useNavigate();
  const { licenseTypes, licenseTypesLoading, licenseTypesError } = useGetLicenseTypes();

  // Initialize useLicense based on existing product's category if editing
  const initialCategory = productCategories?.find((cat) => cat.id === initialValues?.product_category_id);
  const [useLicense, setUseLicense] = useState(initialCategory?.uses_licenses || false);
  const defaultValues = {
    title: '',
    description: '',
    product_category_id: '',
    // Prices as array of objects
    // prices: [
    //   { license_type_id: 1, ngn_amount: 0, usd_amount: 0 }, // Standard
    //   { license_type_id: 2, ngn_amount: 0, usd_amount: 0 } // Premium
    // ],
    prices: licenseTypes.map((licenseType) => ({
      license_type_id: licenseType.id,
      ngn_amount: 0,
      usd_amount: 0
    })),
    currency: 'USD',
    image_url: '',
    sample_url: '',
    featured: false,
    active: true,
    imageFile: null,
    sampleFile: null,
    ...initialValues
  };

  return (
    <Formik initialValues={defaultValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item size={12}>
              <TextField
                fullWidth
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
            </Grid>
            <Grid item size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={values.description || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 12 }}>
              <TextField
                fullWidth
                select
                name="product_category_id"
                label="Category"
                value={values.product_category_id}
                // onChange={handleChange}
                onChange={(e) => {
                  setFieldValue('product_category_id', e.target.value);
                  let hasLicense = productCategories.find((cat) => cat.id === e.target.value)?.uses_licenses;
                  setUseLicense(hasLicense);

                  // Initialize prices array based on license type
                  if (hasLicense) {
                    // Initialize with all license types
                    const newPrices = licenseTypes.map((licenseType) => ({
                      license_type_id: licenseType.id,
                      ngn_price: 0,
                      usd_price: 0
                    }));
                    setFieldValue('prices', newPrices);
                  } else {
                    // Initialize with only standard license
                    setFieldValue('prices', [{ license_type_id: 1, ngn_price: 0, usd_price: 0 }]);
                  }
                }}
                onBlur={handleBlur}
                error={touched.product_category_id && Boolean(errors.product_category_id)}
                helperText={touched.product_category_id && errors.product_category_id}
              >
                {productCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Dynamic Price Fields based on license types */}
            {useLicense ? (
              // Multiple license types - show price fields for each license type
              <>
                {licenseTypes.map((licenseType, index) => {
                  const priceIndex = values.prices?.findIndex((p) => p.license_type_id === licenseType.id) ?? index;
                  return (
                    <Grid item size={12} key={licenseType.id}>
                      <Typography variant="subtitle2" gutterBottom>
                        {licenseType.name} License Pricing
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            type="number"
                            name={`prices.${priceIndex}.ngn_amount`}
                            label={`${licenseType.name} NGN Amount`}
                            value={values.prices?.[priceIndex]?.ngn_amount || ''}
                            onChange={(e) => {
                              const newPrices = [...(values.prices || [])];
                              if (!newPrices[priceIndex]) {
                                newPrices[priceIndex] = { license_type_id: licenseType.id, ngn_amount: 0, usd_amount: 0 };
                              }
                              newPrices[priceIndex].ngn_amount = parseFloat(e.target.value) || 0;
                              setFieldValue('prices', newPrices);
                            }}
                            onBlur={handleBlur}
                            error={touched.prices?.[priceIndex]?.ngn_amount && Boolean(errors.prices?.[priceIndex]?.ngn_amount)}
                            helperText={touched.prices?.[priceIndex]?.ngn_amount && errors.prices?.[priceIndex]?.ngn_amount}
                            slotProps={{ inputProps: { step: '0.01', min: '0' } }}
                          />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            type="number"
                            name={`prices.${priceIndex}.usd_amount`}
                            label={`${licenseType.name} USD Amount`}
                            value={values.prices?.[priceIndex]?.usd_amount || ''}
                            onChange={(e) => {
                              const newPrices = [...(values.prices || [])];
                              if (!newPrices[priceIndex]) {
                                newPrices[priceIndex] = { license_type_id: licenseType.id, ngn_amount: 0, usd_amount: 0 };
                              }
                              newPrices[priceIndex].usd_amount = parseFloat(e.target.value) || 0;
                              setFieldValue('prices', newPrices);
                            }}
                            onBlur={handleBlur}
                            error={touched.prices?.[priceIndex]?.usd_amount && Boolean(errors.prices?.[priceIndex]?.usd_amount)}
                            helperText={touched.prices?.[priceIndex]?.usd_amount && errors.prices?.[priceIndex]?.usd_amount}
                            slotProps={{ inputProps: { step: '0.01', min: '0' } }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              </>
            ) : (
              // Standard license only - show single price fields
              <>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    name="prices.0.ngn_amount"
                    label="NGN Amount (Standard)"
                    value={values.prices?.[0]?.ngn_amount || ''}
                    onChange={(e) => {
                      const newPrices = [...(values.prices || [{ license_type_id: 1, ngn_amount: 0, usd_amount: 0 }])];
                      newPrices[0] = { ...newPrices[0], license_type_id: 1, ngn_amount: parseFloat(e.target.value) || 0 };
                      setFieldValue('prices', newPrices);
                    }}
                    onBlur={handleBlur}
                    error={touched.prices?.[0]?.ngn_amount && Boolean(errors.prices?.[0]?.ngn_amount)}
                    helperText={touched.prices?.[0]?.ngn_amount && errors.prices?.[0]?.ngn_amount}
                    slotProps={{ inputProps: { step: '0.01', min: '0' } }}
                  />
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    name="prices.0.usd_amount"
                    label="USD Amount (Standard)"
                    value={values.prices?.[0]?.usd_amount || ''}
                    onChange={(e) => {
                      const newPrices = [...(values.prices || [{ license_type_id: 1, ngn_amount: 0, usd_amount: 0 }])];
                      newPrices[0] = { ...newPrices[0], license_type_id: 1, usd_amount: parseFloat(e.target.value) || 0 };
                      setFieldValue('prices', newPrices);
                    }}
                    onBlur={handleBlur}
                    error={touched.prices?.[0]?.usd_amount && Boolean(errors.prices?.[0]?.usd_amount)}
                    helperText={touched.prices?.[0]?.usd_amount && errors.prices?.[0]?.usd_amount}
                    slotProps={{ inputProps: { step: '0.01', min: '0' } }}
                  />
                </Grid>
              </>
            )}
            <Grid item size={12}>
              <Typography variant="subtitle1" gutterBottom>
                <FormattedMessage id="upload-product-image" />
              </Typography>

              {/* Image Upload Area */}
              <Box
                sx={{
                  border: '2px dashed #ddd',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  position: 'relative',
                  backgroundColor: values.image_url || values.imageFile ? 'transparent' : '#fafafa'
                }}
              >
                {values.image_url || values.imageFile ? (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Box
                      component="img"
                      // src={values?.image_url}
                      src={values.imageFile ? URL.createObjectURL(values.imageFile) : values.image_url}
                      alt="Product preview"
                      sx={{
                        maxWidth: 200,
                        maxHeight: 200,
                        width: 'auto',
                        height: 'auto',
                        borderRadius: 1,
                        border: '1px solid #ddd'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setFieldValue('imageFile', null);
                        setFieldValue('image_url', '');
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Trash size="16" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <Camera size="48" color="#999" />
                    <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
                      <FormattedMessage id="upload-product-image" />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <FormattedMessage id="click-to-select-image" />
                    </Typography>
                  </Box>
                )}

                {!values.imageFile && !values.image_url && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // handleImageUpload(file, setFieldValue);
                        setFieldValue('imageFile', file);
                        setFieldValue('image', '');
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                )}
              </Box>

              {/* Upload Progress */}
              {isLoading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                    <FormattedMessage id="uploading-image" />
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item size={12}>
              <Typography variant="subtitle1" gutterBottom>
                <FormattedMessage id="upload-product-audio" defaultMessage="Upload Product Audio" />
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ddd',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  position: 'relative',
                  backgroundColor: values.audio_url || values.audioFile ? 'transparent' : '#fafafa'
                }}
              >
                {values.sample_url || values.sampleFile ? (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <audio
                      controls
                      src={values.sampleFile ? URL.createObjectURL(values.sampleFile) : values.sample_url}
                      style={{ width: 200 }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setFieldValue('sampleFile', null);
                        setFieldValue('sample_url', '');
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Trash size="16" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
                      <FormattedMessage id="upload-product-audio" defaultMessage="Upload Product Audio" />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <FormattedMessage id="click-to-select-audio" defaultMessage="Click to select audio file" />
                    </Typography>
                  </Box>
                )}
                {!(values.sample_url || values.sampleFile) && (
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFieldValue('sampleFile', file);
                        setFieldValue('sample_url', '');
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                )}
              </Box>
            </Grid>

            {/* <Grid item size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                select
                name="currency"
                label="Currency"
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
            </Grid> */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={<Switch checked={values.featured} onChange={(e) => setFieldValue('featured', e.target.checked)} name="featured" />}
                label="Featured Product"
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={<Switch checked={values.active} onChange={(e) => setFieldValue('active', e.target.checked)} name="active" />}
                label="Active"
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 12 }}>
              <Box display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button type="button" variant="outlined" onClick={() => navigate('/products')}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Product'}
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
