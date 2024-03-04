import { useEffect, useState } from 'react';
import { Avatar, Button, Card, Container, Stack, Typography } from "@mui/material"
import AddCommentIcon from '@mui/icons-material/AddComment';
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from 'firebase/firestore';
import { Loader } from '../../components';
import { db } from '../../services/firebase';

const Conversations = () => {
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ conversations, setConversations] = useState([]);

    const getConversations = async () => {
        const conversationsRef = collection(db, "conversations");
        const conversationsSnapshot = await getDocs(conversationsRef);

        const conversationsList = conversationsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        setConversations(conversationsList);
        setLoading(false);
    }

    useEffect(() => {
        getConversations();
    }, []);

    return (
        <Container>
            <Stack direction='row' justifyContent='space-between' mb={4}>
                <Typography variant="h4">Conversations</Typography>
                <Button variant="contained" size="small" onClick={() => navigate(`/create-conversations`)}>
                    <AddCommentIcon />
                </Button>
            </Stack>
            { loading ? 
                <Stack sx={{ width: '100%', height: '40vh' }} spacing={2} alignItems="center" justifyContent="center">
                    <Loader/>
                </Stack> : 
                <Stack direction='column' spacing={2} >
                    {conversations.map((conversation, i) => (
                        <Card key={i} onClick={() => navigate(`/conversations/${conversation.id}`)} sx={{ p: 2, '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.1)', } }}>
                            <Stack direction='row' spacing={2} >
                                <Avatar alt={conversation.name} src={conversation.icon_url} sx={{ width: 56, height: 56 }} />
                            
                                <Stack>
                                    <Typography variant="h6">
                                        {conversation.name}
                                    </Typography>

                                    <Typography variant="body1">
                                        {conversation.users.length} participants
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Card>
                    ))}
                </Stack>}

        </Container>
    );
}

export default Conversations;