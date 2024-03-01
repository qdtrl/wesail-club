import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; 
import { auth, db } from "../../services/firebase";
import { Avatar, Box, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Loader } from "../../components";
import PropTypes from 'prop-types';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const Club = () => {
    const [ club, setClub ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ tab, setTab ] = useState(0);

    const { id } = useParams();

    const navigate = useNavigate();

    const getClub = async () => {
        const clubRef = doc(db, "clubs", id);
        const clubDoc = await getDoc(clubRef);

        if (clubDoc.exists()) {
            setClub(clubDoc.data());
        } else  {
            navigate('/404');
        }
        
        setLoading(false);
    };

    useEffect(() => {
        getClub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            { loading ? 
            <Stack sx={{ width: '100%', height: '40vh' }} spacing={2} alignItems="center" justifyContent="center">
                <Loader/>
            </Stack> : 
            <>
                <Stack direction="row" spacing={2} sx={{ pb: 2 }} alignItems='center'>
                    <Avatar alt={auth.currentUser.displayName} src={auth.currentUser.photoURL} sx={{ width: 56, height: 56 }} />
                    <Typography variant="h4" gutterBottom>
                        {club.name}
                    </Typography>
                </Stack>
                
                <Typography variant="body1" gutterBottom>
                    {club.description}
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={(e, n) => setTab(n)} aria-label="basic tabs example">
                        <Tab label="Évènements" {...a11yProps(0)} />
                        <Tab label="Photos" {...a11yProps(1)} />
                        <Tab label="Bateaux" {...a11yProps(2)} />
                        <Tab label="Membres" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tab} index={0}>
                    Liste des évènements du club
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={1}>
                    Liste des photos du club
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={2}>
                    Liste des bateaux du club
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={3}>
                    Liste des membres du club
                </CustomTabPanel>
            </>}
        </Container>
    )
}

export default Club
