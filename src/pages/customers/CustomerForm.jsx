import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// material-ui
import { Grid, TextField, Button, Box, Stack } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// validation schema
const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required').max(50, 'First name must be 50 characters or less'),
  last_name: Yup.string().required('Last name is required').max(50, 'Last name must be 50 characters or less'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone is required').max(20, 'Phone must be 20 characters or less')
});

// ==============================|| CUSTOMER FORM ||============================== //

export default function CustomerForm({ initialValues, onSubmit, isLoading = false }) {
  const defaultValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    ...initialValues
  };

  return (
    <Formik initialValues={defaultValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="first_name"
                label={<FormattedMessage id="first-name" />}
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="last_name"
                label={<FormattedMessage id="last-name" />}
                value={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="email"
                name="email"
                label={<FormattedMessage id="email" />}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phone"
                label={<FormattedMessage id="phone" />}
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button type="button" variant="outlined">
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? <FormattedMessage id="saving" /> : <FormattedMessage id="save-customer" />}
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
