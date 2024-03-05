import { useEffect, useState } from "react";
import { auth, db, storage } from "../../services/firebase";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { Avatar, Box, Button, Card, CircularProgress, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import { Loader, MultipleSelectCheckmarks } from "../../components";
import { useNavigate } from "react-router-dom";

const CreateConversation = () => {
    const navigate = useNavigate();
    const [ icon, setIcon ] = useState(null);
    const [ clubs, setClubs ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ admins, setAdmins ] = useState([]);
    const [ convUsers, setConvUsers ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ progress, setProgress ] = useState(0);

    const [ conversation, setConversation ] = useState({
        name: '',
        icon_url: '',
        admins: [],
        users: [],
    });

    const uploadIcon = async () => {
        const storageRef = ref(storage, `conversations/icons/${conversation.name}`);
        const uploadTask = uploadBytesResumable(storageRef, icon);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                toast.error(error.message);
                setLoading(false);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setConversation(prev => {
                        return {
                            ...prev,
                            icon_url: downloadURL
                        }
                    }); 
                });
            }
        );
    };

    const getUsers = async () => {
        setLoading(true);
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        const usersList = usersSnapshot.docs.map(doc => ( { ...doc.data(), id: doc.id }));

        setUsers(usersList);
        setLoading(false);
    };

    const getClubs = async () => {
        setLoading(true);
        const clubsRef = collection(db, "clubs");
        const clubsSnapshot = await getDocs(clubsRef);

        const clubsList = clubsSnapshot.docs.map(doc => ( { ...doc.data(), id: doc.id }));
                
        setConversation(prev => {
            return {
                ...prev,
                admins: [ auth.currentUser.uid ],
                users: [ auth.currentUser.uid ]
            }
        });

        setClubs(clubsList);
        setLoading(false);
    };

    useEffect(() => {
        getUsers();
        getClubs();
    }, []);

    useEffect(() => {
        if (conversation.icon_url){
            addDoc(collection(db, "conversations"), {
                ...conversation,
                created_at: serverTimestamp()
            })
            .then((e) => {
                setLoading(false);
                toast.success('La conversation a été créé avec succès');
                navigate(`/conversations/${e.id}`);
            })
        }
    }, [conversation, navigate]);

    useEffect(() => {
        setConversation(prev => {
            return {
                ...prev,
                admins: [ auth.currentUser.uid, ...admins ]
            }
        });
        setConversation(prev => {
            return {
                ...prev,
                users: [ auth.currentUser.uid, ...convUsers]
            }
        });
    }, [admins, convUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        await uploadIcon();
    }
    
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Créer une conversation
            </Typography>
            <form>
                <Stack alignItems='center' spacing={2} sx={{marginBottom: 2}}>
                    <Card sx={{ p: 2 }}>
                        <Stack spacing={4} sx={{minWidth: 300}}>
                            <Stack alignItems='center' >
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        alt="icon"
                                        src={icon ? URL.createObjectURL(icon) : ""}
                                        sx={{ width: 100, height: 100, zIndex: 1}}
                                    />
                                    { loading && (
                                    <CircularProgress
                                        variant="determinate"
                                        value={progress}
                                        size={104}
                                        sx={{
                                        color: 'green',
                                        position: 'absolute',
                                        top: -2,
                                        left: -2,
                                        zIndex: 0,
                                        }}
                                    />
                                    )}
                                </Box>
                            </Stack> 

                            <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => setIcon(e.target.files[0])} />

                            <Divider />

                            <TextField
                                label="Nom"
                                variant="outlined"
                                required
                                value={conversation.name}
                                onChange={(e) => setConversation(prev => {
                                    return {
                                        ...prev,
                                        name: e.target.value
                                    }
                                })}/>

                            <MultipleSelectCheckmarks 
                                tag="Administrateurs"
                                users={users}
                                clubs={clubs}
                                selects={admins}
                                setSelects={setAdmins} />

                            <MultipleSelectCheckmarks 
                                tag="Participants"
                                users={users}
                                clubs={clubs}
                                selects={convUsers}
                                setSelects={setConvUsers} />

                        </Stack>
                        
                    </Card>

                    <Stack alignItems='center'  >
                        { !loading ? 
                        <Button onClick={handleSubmit} variant="contained"  >
                            Créer
                        </Button> : <Loader />}
                    </Stack>
                </Stack>
            </form>
        </Container>
    )
}

export default CreateConversation;