import { ref, push } from "firebase/database";
import { useEffect, useState } from 'react';
import { Button, Container, Stack, Typography } from "@mui/material"
import { rtdb } from '../../services/firebase';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { useNavigate } from "react-router-dom";

const Conversations = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);

    useEffect(() => {

    }, []);

    return (
        <Container>
            <Stack direction='row' justifyContent='space-between'>
                <Typography variant="h4">Conversations</Typography>
                <Button variant="contained" size="small" onClick={() => navigate(`/create-conversations`)}>
                    <AddCommentIcon />
                </Button>
            </Stack>
            {}
        </Container>
    );
}

export default Conversations;