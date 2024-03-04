import { Avatar, Button, Card, Container, Stack, TextField, Typography } from "@mui/material"
import { Loader } from "../../components";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ref, push, onValue } from 'firebase/database';
import { auth, db, rtdb } from "../../services/firebase";
import SettingsIcon from '@mui/icons-material/Settings';

const Conversation = () => {
    const [ conversation, setConversation ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ clubId, setClubId ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [ message, setMessage ] = useState({
        content: '',
        user: '',
        files: [],
        timestamp: '',
    });

    const { id } = useParams();

    const navigate = useNavigate();

    const getConversation = async () => {
        setLoading(true);
        const convRef = doc(db, "conversations", id);
        const convDoc = await getDoc(convRef);

        if (convDoc.exists()) {
            setConversation(convDoc.data());
        } else  {
            navigate('/404');
        }
        
        setLoading(false);
    };

    console.log(messages);


    const postMessage = async () => {
        push(ref(rtdb, `conversations/${id}/messages`), message);
    };

    useEffect(() => {
        const fetchClubId = async () => {
            setLoading(true);

            const user = auth.currentUser;
      
            if (user) {
              const clubsRef = collection(db, "clubs");
              const q = query(clubsRef, where("user_id", "==", user.uid));
              const querySnapshot = await getDocs(q);
        
              if (querySnapshot.docs[0].exists()) {
                  setClubId(querySnapshot.docs[0].id);
              }
            }
            setLoading(false);
          };
      
        fetchClubId();
        getConversation();
        const convRef = ref(rtdb, `conversations/${id}/messages`);
        
        onValue(convRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log(data);
                setMessages(Object.values(data));
            }
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            { loading ? 
            <Stack sx={{ width: '100%', height: '40vh' }} spacing={2} alignItems="center" justifyContent="center">
                <Loader/>
            </Stack> :
            <Stack direction='column' spacing={2} >
                <Stack direction="row" justifyContent='space-between' alignItems='center' mb={4}>
                    <Stack direction="row" spacing={2} alignItems='center'>
                        <Avatar alt={conversation.name} src={conversation.icon_url} sx={{ width: 56, height: 56 }} />
                        <Typography variant="h4" gutterBottom>
                            {conversation.name}
                        </Typography>
                    </Stack>
                    { conversation.admins.includes(clubId) && <Button variant="contained" onClick={() => navigate(`/conversations/${id}/edit`)}>
                        <SettingsIcon />
                    </Button>}
                </Stack>


                <Card sx={{ p: 2}}>
                    <Stack direction='column' spacing={2} >
                        {messages.map((message, i) => (
                            <Stack key={i} sx={{ p: 2, '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.1)', } }}>
                                <Stack direction='row' spacing={2} >
                                    <Avatar alt={message.user} src={message.icon_url} sx={{ width: 56, height: 56 }} />
                                    <Stack>
                                        <Typography variant="h6">
                                            {message.user}
                                        </Typography>
                                        <Typography variant="body1">
                                            {message.content}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        ))
                        }

                        <Stack direction='row' spacing={2} >
                            <TextField
                                fullWidth
                                id="outlined-multiline-static"
                                label="Message"
                                multiline
                                rows={2}
                                defaultValue="Votre message"
                                variant="outlined"
                                value={message.content}
                                onChange={(e) => setMessage({ ...message, content: e.target.value })}
                            />
                            
                                
                        
                            <Stack>
                                <Button variant="contained" onClick={postMessage}>Envoyer</Button>
                                <Button 
                                    variant="contained">Joindre un fichier</Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
        }
        </Container>
    )
}

export default Conversation;