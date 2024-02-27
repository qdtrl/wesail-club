import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Stack } from '@mui/material';
import { Suspense } from 'react';
import { Router } from 'react-router-dom';
import { Loader } from './components';

const App = () => {
  return (
    <Router>
      <Suspense fallback={
            <Stack sx={{ width: '100%', height: '100vh' }} spacing={2} alignItems="center" justifyContent="center">
              <Loader/>
            </Stack>}></Suspense>

    </Router>
  )
}

export default App;
