import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Stack } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Alerts, Loader } from './components';
import { Club, Clubs, ForgotPassword, Home, Layout, Login, NoMatch, Register, UpdateClub } from './pages';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user?.displayName ? setCurrentUser(user) : setCurrentUser(null);
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return unsubscribe;
  }, []);

  return (
    <Alerts>
      <Router>
        <Suspense fallback={
          <Stack sx={{ width: '100%', height: '100vh' }} spacing={2} alignItems="center" justifyContent="center">
            <Loader/>
          </Stack>}>

          { !currentUser &&
          <Routes>
            <Route path="/" exact element={<Login/>}/>
            <Route path="/signup" element={<Register/>}/> 
            <Route path="/forgotpassword" element={<ForgotPassword/>}/>
            <Route path='*' element={<NoMatch />}/>
          </Routes>}

          { currentUser &&
          <Layout>
            <Routes>
              <Route path="/" exact element={<Home/>}/>
              <Route path="/clubs" exact element={<Clubs/>}/>
              <Route path="/clubs/:id" exact element={<Club/>}/>
              <Route path="/clubs/:id/update" element={<UpdateClub/>}/>
              <Route path='*' element={<NoMatch />}/>
            </Routes>
          </Layout>
          }

        </Suspense>
      </Router>
    </Alerts>
  )
}

export default App;
