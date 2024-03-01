import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Stack } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { 
  Alerts, 
  Loader,
  NoMatch,
  Layout } from './components';

import { 
  Account, 
  Club,
  ClubManagement,
  Clubs,
  Conversation,
  Conversations,
  CreateEvent,
  Event,
  Events,
  ForgotPassword,
  Home,
  Login,
  Register,
  UpdateEvent } from './pages';
  
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [ currentUser, setCurrentUser ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { 
      setCurrentUser(user);
      setLoading(false);
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return unsubscribe;
  }, []);

  return (
    <Alerts>
      <Router>
        <Suspense fallback={
          <Stack sx={{ width: '100%', height: '98vh' }} spacing={2} alignItems="center" justifyContent="center">
            <Loader/>
          </Stack>}>

          { !currentUser &&
          <Routes>
            <Route path="/" exact element={<Login/>}/>
            <Route path="/signup" element={<Register/>}/> 
            <Route path="/forgotpassword" element={<ForgotPassword/>}/>
            <Route path='*' element={loading ? 
                <Stack sx={{ width: '100%', height: '98vh' }} spacing={2} alignItems="center" justifyContent="center">
                  <Loader/>
                </Stack> : <NoMatch />}/>
          </Routes>}

          { currentUser &&
          <Layout>
            <Routes>
              <Route path="/" exact element={<Home/>}/>

              <Route path="/events" exact element={<Events/>}/>
              <Route path="/events/:id" exact element={<Event/>}/>
              <Route path="/events/:id/update" exact element={<UpdateEvent/>}/>
              <Route path="/events/:id/new" exact element={<CreateEvent/>}/>

              <Route path="/conversations" exact element={<Conversations/>}/>
              <Route path="/conversations/:id" exact element={<Conversation/>}/>

              <Route path="/clubs" exact element={<Clubs/>}/>
              <Route path="/clubs/:id" exact element={<Club/>}/>

              <Route path="/dashboard/account" element={<Account/>}/>
              <Route path="/dashboard/club-management" element={<ClubManagement/>}/>
              
              <Route path='*' element={loading ? 
                <Stack sx={{ width: '100%', height: '98vh' }} spacing={2} alignItems="center" justifyContent="center">
                  <Loader/>
                </Stack> : <NoMatch />}/>
            </Routes>
          </Layout>
          }

        </Suspense>
      </Router>
    </Alerts>
  )
}

export default App;
