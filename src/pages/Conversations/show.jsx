import { Avatar, Button, Container, IconButton, LinearProgress, Stack, TextField, Typography } from "@mui/material"
import { Loader } from "../../components";
import { useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ref, push, onValue, serverTimestamp, set } from 'firebase/database';
import { auth, db, rtdb } from "../../services/firebase";
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon from '@mui/icons-material/Send';
import IosShareIcon from '@mui/icons-material/IosShare';
import ClearIcon from '@mui/icons-material/Clear';
import { CardCover, Card } from "@mui/joy";

const Conversation = () => {
    const [ conversation, setConversation ] = useState();
    const [ users, setUsers ] = useState([]);
    const [ images, setImages ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ update, setUpdate ] = useState(false);
    const [ progress, setProgress ] = useState({
        images: [] 
    });
    const [ messages, setMessages ] = useState([]);
    const [ message, setMessage ] = useState("");

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView()
    }
  
    useEffect(() => {
        if (messages && users) scrollToBottom()
    }, [messages, users, images]);

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



    useEffect(() => {
        const getUser = async (id) => {
            const userDoc = await getDoc(doc(db, 'users', id));
            if (userDoc.exists()) return { ...userDoc.data(), id: userDoc.id }
            const clubDoc = await getDoc(doc(db, 'clubs', id));
            if (clubDoc.exists()) return { ...clubDoc.data(), id: clubDoc.id }
        };

          
        const getUsersConversation = async () => {
            setLoading(true);
            const userPromises = conversation.users.map(id => getUser(id));
            const usersList = await Promise.all(userPromises);
            return usersList;
        };

        if (conversation) {
            getUsersConversation()
            .then(usersList => {
                setUsers(usersList);
                setLoading(false);
            });
        }
    }, [conversation]);


    console.log(messages);
    console.log(conversation);
    console.log(users);

    const postMessage = async () => {
        push(ref(rtdb, `conversations/${id}/messages`), {
            content: message,
            created_at: serverTimestamp(),
            user_id: auth.currentUser.uid,
        });
        setMessage("");
    };

    useEffect(() => {
        getConversation();
        const convRef = ref(rtdb, `conversations/${id}/messages`);
        
        onValue(convRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
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
                    { conversation.admins.includes(auth.currentUser.uid) && <Button variant="contained" onClick={() => navigate(`/conversations/${id}/edit`)}>
                        <SettingsIcon />
                    </Button>}
                </Stack>


                    <Stack direction='column' spacing={2} sx={{ height: '70vh', overflowY: 'auto'}}>
                        {users && messages.map((message, i) => {
                            const user = users.find(user => user.id === message.user_id);
                            const isMyMessage = user?.id === auth.currentUser.uid;
                            return  (
                            <Stack key={i} alignItems={isMyMessage ? 'flex-end' : 'flex-start'}>
                                <Card sx={{p: 2, width: 400, maxWidth: '98vw', backgroundColor: false ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.2)'}}>
                                {isMyMessage ?
                                    <Typography variant="body1">
                                        {message.content}
                                    </Typography>
                                    :
                                    <Stack direction='row' spacing={2} >
                                        <Avatar alt={user?.name} src={user.icon_url} sx={{ width: 56, height: 56 }} />
                                        <Stack>
                                            <Typography variant="h6">
                                                {user.name}
                                            </Typography>
                                            <Typography variant="body1">
                                                {message.content}
                                            </Typography>
                                        </Stack>
                                    </Stack>}
                                </Card>
                            </Stack>)
                            })}
                            { images.length > 0 && <Stack spacing={2} alignItems='flex-end'>
                                <Card sx={{p: 2, width: 400, maxWidth: '98vw', height: 100, backgroundColor: 'rgba(0,0,0,0.1)', overflow: 'auto'}}>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                    { images.map((image, i) => (
                                        <Card key={i} sx={{ width: 'auto',maxWidth: 200, height: 'auto', maxHeight: 100, }}>
                                            <CardCover>
                                                <img src={URL.createObjectURL(image)} alt="preview" style={{ width: '100%', height: 'auto' }} />
                                            </CardCover>
                                            <Stack alignItems='flex-end' sx={{height: '100%', zIndex: 1}}>
                                                { (progress.images[i] || 0) !== 0 ? 
                                                    <Stack sx={{ width: '100%' }} >
                                                        <LinearProgress variant="determinate" value={progress.images[i] || 0} />
                                                    </Stack> 
                                                :
                                                    <IconButton color="error" 
                                                    sx={{ 
                                                        background: 'rgba(0,0,0,0.3)',
                                                        '&:hover': {
                                                            background: 'rgba(100,0,0,0.5)',
                                                            color: 'white'
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        if (!loading) {
                                                            setImages(prev => prev.filter((img, imgIndex) => imgIndex !== i));
                                                        }
                                                    }}>
                                                        <ClearIcon />
                                                    </IconButton>}
                                                </Stack>
                                        </Card>
                                    ))}
                                    </Stack>
                                </Card>
                            </Stack>}
                            <div ref={messagesEndRef} />
                    </Stack>

                    <Stack direction='row' spacing={2} sx={{bottom: 0}}>
                        <TextField
                            fullWidth
                            id="outlined-multiline-static"
                            label="Message"
                            multiline
                            rows={2}
                            defaultValue="Votre message"
                            variant="outlined"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    postMessage();
                                }
                            }}
                        />
                        
                            
                    
                        { update ?
                            <Stack sx={{width: 144}} alignItems='center'>
                                <Loader />
                            </Stack>
                             : 
                            <Stack direction='row' spacing={2} alignItems='flex-start'>
                                <label htmlFor="icon-button-file">
                                    <Button variant="contained" component="span">
                                        <IosShareIcon />
                                    </Button>
                                </label>

                                <input
                                    accept="image/*"
                                    id="icon-button-file"
                                    type="file"
                                    onChange={(e) => {
                                        for (let i = 0; i < e.target.files.length; i++) {
                                            setImages(prev => {
                                                return [...prev, e.target.files[i]]
                                            });
                                        }}}
                                    multiple
                                    style={{ display: 'none' }}
                                />

                                <Button variant="contained" onClick={postMessage}>
                                    <SendIcon />
                                </Button>
                            </Stack>}
                    </Stack>
            </Stack>
        }
        </Container>
    )
}

export default Conversation;