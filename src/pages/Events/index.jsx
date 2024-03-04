import { Autocomplete, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { Card, CardCover } from '@mui/joy';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../../services/firebase";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components";
import AddIcon from '@mui/icons-material/Add';
import { moment } from "../../config/config";

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
        <Container sx={{ pb: 4 }}>
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
                        <Card key={i} sx={{ maxWidth: '98vw', minWidth: 300, height: 400 }} >
                            <CardCover>
                                {event.cover.includes('mp4') ?
                                <video autoPlay loop muted >
                                    <source src={event.cover} type="video/mp4" />
                                </video>: 
                                <img src={event.cover} alt="cover" /> }
                            </CardCover>
                            <Stack justifyContent='flex-end' sx={{  zIndex: 0, background: 'rgba(0,0,0,0.7)', color: 'white', position: 'absolute', bottom: 0, left: 0, p: 1, right: 0, borderRadius: 'inherit' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
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
                                    <Typography variant="body2">
                                        {moment(event.start_date).format('L')} - {moment(event.end_date).format('L')}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2">
                                    {event.address} {event.city}, {event.zipcode}
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">
                                        {event.members ? event.members.length : 0} participants
                                    </Typography>

                                    <Button size="small" onClick={() => navigate(`/conversations`)}>
                                        <QuestionAnswerIcon />
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </>}
        </Container>
    )
}

export default Events;