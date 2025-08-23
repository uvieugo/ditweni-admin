// import { Link } from 'react-router-dom';

// material-ui
// import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports

// import useAuth from 'hooks/useAuth';

import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// assets

// ================================|| LOGIN ||================================ //

export default function Login() {
  // const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthLogin forgot="/auth/forgot-password" />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
