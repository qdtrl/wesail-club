import { Autocomplete, Button, Card, CardContent, CardMedia, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../../services/firebase";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components";

const Clubs = () => {
    const [ clubs, setClubs ] = useState([]);
    const [ filteredClubs, setFilteredClubs ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ search , setSearch ] = useState('');

    const navigate = useNavigate();

    const getClubs = async () => {
        const clubsRef = collection(db, "clubs");
        const clubsSnapshot = await getDocs(clubsRef);
  
        const clubsList = clubsSnapshot.docs.map(doc => doc.data());
        
        setClubs(clubsList);
        setLoading(false);
    };
    
    useEffect(() => {
        getClubs();
    }, []);

    useEffect(() => {
        if (search){
            setFilteredClubs(clubs.filter(club => club.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredClubs(clubs);
        }
    }, [search, clubs]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Les clubs
            </Typography>

            { loading ? 
            <Stack sx={{ width: '100%', height: '40vh' }} spacing={2} alignItems="center" justifyContent="center">
                <Loader/>
            </Stack> : 
            <>
                <Autocomplete
                    options={clubs.map(club => club.name)}
                    renderInput={(params) => <TextField {...params} label="Rechercher un club" />}
                    onInputChange={(event, value) => setSearch(value)}
                    sx={{ pb: 2 }}
                />
            
                <Stack flexWrap='wrap' gap={2} sx={{ width: '100%' }}>
                    {filteredClubs.map((club, i) => (
                        <Card key={i} sx={{ maxWidth: '98vw', minWidth: 300 }} >
                            <CardMedia
                            sx={{ height: 400 }}
                            image={club.photo_url}
                            title={`Logo du club ${club.name}`}
                            />
                            <CardContent>
                                <Typography 
                                    gutterBottom 
                                    variant="h5" 
                                    component="div" 
                                    onClick={() => navigate(`/clubs/${club.user_id}`)} 
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {club.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {club.city} Granville
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: '100%'}}>
                                    <Typography variant="body2" color="text.secondary">
                                        {club.members ? club.members.length : 0} membres
                                    </Typography>

                                    <Button size="small" onClick={() => navigate(`/conversations`)}>
                                        <QuestionAnswerIcon />
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </>}
        </Container>
    )
}

export default Clubs;
