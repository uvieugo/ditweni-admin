import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// material-ui
import { Grid, TextField, Button, Box, Stack } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').max(50, 'Name must be 50 characters or less'),
  provider: Yup.string().required('Provider is required')
});

// ==============================|| PAYMENT METHOD FORM ||============================== //

export default function PaymentMethodForm({ initialValues, onSubmit, isLoading = false }) {
  const defaultValues = {
    name: '',
    provider: '',
    settings: {},
    ...initialValues
  };

  return (
    <Formik initialValues={defaultValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item size={12}>
              <TextField
                fullWidth
                name="name"
                label={<FormattedMessage id="name" />}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>

            <Grid item size={12}>
              <TextField
                fullWidth
                name="provider"
                label={<FormattedMessage id="provider" />}
                value={values.provider}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.provider && Boolean(errors.provider)}
                helperText={touched.provider && errors.provider}
              />
            </Grid>

            <Grid item size={12}>
              <Box display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button type="button" variant="outlined">
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
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
