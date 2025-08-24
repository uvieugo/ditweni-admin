import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

// project imports
import { uploadImage } from 'api/product-categories';

// validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Title is required').max(255, 'Title must be 255 characters or less'),
  description: Yup.string().required('Description is required')
  // category: Yup.string().required('Category is required'),
  // price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
  // currency: Yup.string().required('Currency is required'),
  // image: Yup.string().nullable(), // Will be set by backend after upload
  // featured: Yup.boolean(),
  // active: Yup.boolean()
});

// sample categories - replace with your actual categories
// const categories = ['merch', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Health & Beauty', 'Automotive', 'Other'];

// sample currencies - replace with your actual currencies
// const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

// ==============================|| PRODUCT FORM ||============================== //

export default function ProductForm({ initialValues, onSubmit, isLoading = false }) {
  const navigate = useNavigate();

  const defaultValues = {
    name: '',
    description: '',
    uses_licenses: false,
    image_url: '',
    imageFile: null,
    ...initialValues
  };

  // console.log(initialValues);
  // console.log(defaultValues);

  return (
    <Formik initialValues={defaultValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.uses_licenses}
                    onChange={(e) => setFieldValue('uses_licenses', e.target.checked)}
                    name="uses_license"
                  />
                }
                label="Uses Licenses"
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 12 }}>
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
                      src={values.imageFile ? URL.createObjectURL(values.imageFile) : values.image_url}
                      alt="Product preview"
                      sx={{
                        maxWidth: 'auto',
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
                        setFieldValue('image_url', '');
                        setFieldValue('imageFile', null);
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

            <Grid item size={{ xs: 12 }}>
              <Box display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button type="button" variant="outlined" onClick={() => navigate('/product-categories')}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Category'}
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
