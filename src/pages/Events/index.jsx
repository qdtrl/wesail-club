import { Autocomplete, Button, Card, CardContent, CardMedia, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../../services/firebase";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components";
import AddIcon from '@mui/icons-material/Add';

const Events = () => {
    const [ events, setEvents ] = useState([]);
    const [ filteredEvents, setFilteredEvents ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ search , setSearch ] = useState('');

    const navigate = useNavigate();

    const getEvents = async () => {
        const eventsRef = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsRef);
        
        const eventsList = eventsSnapshot.docs.map(doc => ( { ...doc.data(), id: doc.id }));
        
        setEvents(eventsList);
        setLoading(false);
    };
    
    useEffect(() => {
        getEvents();
    }, []);

    useEffect(() => {
        if (search){
            setFilteredEvents(events.filter(event => event.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredEvents(events);
        }
    }, [search, events]);

    return (
        <Container>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 2 }}>
                <Typography variant="h4">
                    Les événements
                </Typography>

                <Button variant="contained" onClick={() => navigate('/create-events')} startIcon={<AddIcon/>}>
                    Créer un événement
                </Button>
            </Stack>
            { loading ? 
            <Stack sx={{ width: '100%', height: '40vh' }} spacing={2} alignItems="center" justifyContent="center">
                <Loader/>
            </Stack> : 
            <>
                <Autocomplete
                    options={events.map(event => event.name)}
                    renderInput={(params) => <TextField {...params} label="Rechercher un événement" />}
                    onInputChange={(event, value) => setSearch(value)}
                    sx={{ pb: 2 }}
                />
            
                <Stack flexWrap='wrap' gap={2} sx={{ width: '100%' }}>
                    {filteredEvents.length === 0 && <Typography variant="body1">Aucun événement trouvé...</Typography>}
                    {filteredEvents.map((event, i) => (
                        <Card key={i} sx={{ maxWidth: '98vw', minWidth: 300 }} >
                            <CardMedia
                            sx={{ height: 400 }}
                            image={event.photo_url}
                            title={`Logo du event ${event.name}`}
                            />
                            <CardContent>
                                <Typography 
                                    gutterBottom 
                                    variant="h5" 
                                    component="div" 
                                    onClick={() => navigate(`/events/${event.id}`)} 
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {event.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {event.city}
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: '100%'}}>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.members ? event.members.length : 0} membres
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

export default Events;