import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import SettingForm from './Form';
import { getSiteSettings, updateSiteSetting } from 'api/site-settings';

// material-ui
import { Alert, CircularProgress, Box } from '@mui/material';

// ==============================|| SITE SETTING EDIT ||============================== //

export default function SiteSetting() {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [siteSetting, setSiteSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSiteSetting = async () => {
      try {
        const data = await getSiteSettings();
        setSiteSetting(data);
      } catch (err) {
        setError(err.message || 'Failed to load site setting');
      } finally {
        setLoading(false);
      }
    };

    // if (id) {
    loadSiteSetting();
    // }
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSaving(true);
    setError(null);

    try {
      await updateSiteSetting(siteSetting.id, values);
      navigate('/settings');
    } catch (err) {
      setError(err.message || 'Failed to update site setting');
      setSubmitting(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !siteSetting) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <MainCard title="Edit Product">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <SettingForm initialValues={siteSetting} onSubmit={handleSubmit} isLoading={saving} />
    </MainCard>
  );
}
