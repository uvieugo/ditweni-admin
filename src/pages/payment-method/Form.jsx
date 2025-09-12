import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';

// material-ui
import { Grid, TextField, Button, Box, Stack, IconButton, Typography } from '@mui/material';
// import { Add, Remove } from '@mui/icons-material';
import { Add, Trash } from 'iconsax-reactjs';

// third-party
import { FormattedMessage } from 'react-intl';

// validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').max(50, 'Name must be 50 characters or less'),
  provider: Yup.string().required('Provider is required'),
  settings: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.string().required('Key is required'),
        value: Yup.string().required('Value is required')
      })
    )
    .test('unique-keys', 'Keys must be unique', (settings) => {
      if (!settings) return true;
      const keys = settings.map((s) => s.key);
      return keys.length === new Set(keys).size;
    })
});

// ==============================|| PAYMENT METHOD FORM ||============================== //

export default function PaymentMethodForm({ initialValues, onSubmit, isLoading = false }) {
  const navigate = useNavigate();
  const defaultValues = {
    name: '',
    provider: '',
    ...initialValues,
    // If initialValues.settings is an object, convert to array
    settings: Array.isArray(initialValues?.settings)
      ? initialValues.settings
      : initialValues?.settings
        ? Object.entries(initialValues.settings).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }]
  };

  // Transform settings array to object for backend
  const handleSubmit = (values, formikHelpers) => {
    const settingsObj = {};
    values.settings.forEach(({ key, value }) => {
      if (key) settingsObj[key] = value;
    });
    const payload = {
      name: values.name,
      provider: values.provider,
      settings: settingsObj
    };
    onSubmit(payload, formikHelpers);
  };

  return (
    <Formik initialValues={defaultValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
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
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <FormattedMessage id="settings" defaultMessage="Settings" />
              </Typography>
              {values.settings.map((setting, idx) => (
                <Box key={idx} display="flex" alignItems="center" sx={{ mb: 1 }}>
                  <TextField
                    name={`settings.${idx}.key`}
                    label={<FormattedMessage id="key" defaultMessage="Key" />}
                    value={setting.key}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.settings?.[idx]?.key && Boolean(errors.settings?.[idx]?.key)}
                    helperText={touched.settings?.[idx]?.key && errors.settings?.[idx]?.key}
                    sx={{ mr: 1, minWidth: 160 }}
                  />
                  <TextField
                    name={`settings.${idx}.value`}
                    label={<FormattedMessage id="value" defaultMessage="Value" />}
                    value={setting.value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.settings?.[idx]?.value && Boolean(errors.settings?.[idx]?.value)}
                    helperText={touched.settings?.[idx]?.value && errors.settings?.[idx]?.value}
                    sx={{ mr: 1, minWidth: 220 }}
                  />
                  <IconButton
                    aria-label="remove setting"
                    color="error"
                    disabled={values.settings.length === 1}
                    onClick={() => {
                      const newSettings = values.settings.filter((_, i) => i !== idx);
                      setFieldValue('settings', newSettings);
                    }}
                  >
                    <Trash />
                  </IconButton>
                  {idx === values.settings.length - 1 && (
                    <IconButton
                      aria-label="add setting"
                      color="primary"
                      onClick={() => {
                        setFieldValue('settings', [...values.settings, { key: '', value: '' }]);
                      }}
                    >
                      <Add />
                    </IconButton>
                  )}
                </Box>
              ))}
              {typeof errors.settings === 'string' && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.settings}
                </Typography>
              )}
            </Grid>

            <Grid item size={12}>
              <Box display="flex" justifyContent="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button type="button" variant="outlined" onClick={() => navigate(-1)}>
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
