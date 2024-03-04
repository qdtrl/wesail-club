import { useEffect, useState } from "react";
import { doc, getDoc} from "firebase/firestore";
import { auth, db, storage } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Card, CircularProgress, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import { Loader } from "../../components";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const ClubManagement = () => {
    const navigate = useNavigate();
    const [ club, setClub ] = useState();
    const [ cover, setCover ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ progress, setProgress ] = useState(0);

    useEffect(() => {
        if (cover) {
            setLoading(true);
            handleUpload(cover);
        }
    }, [cover]);

    const handleUpload = (e) => {
        const storageRef = ref(storage, `users/covers/${e.name}`);
        const uploadTask = uploadBytesResumable(storageRef, e);
    
        uploadTask.on('state_changed', 
            (snapshot) => {
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            }, 
            (error) => {
                toast.error(error.message);
                setLoading(false);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setCover(prev => {
                        return {
                            ...prev,
                            cover_url: downloadURL
                        }
                    });
                    setLoading(false);
                });
            }
        );
    };


    useEffect(() => {
        const fetchData = async () => {
            const clubRef = doc(db, "clubs", auth.currentUser.uid);
            const clubDoc = await getDoc(clubRef);

            if (clubDoc.exists()) {
                setClub(clubDoc.data());
            } else {
                navigate('/');
            }
            
            setLoading(false);
        };
    
        fetchData();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Container>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Typography variant="h4" gutterBottom>
                    Modifier les informations du club
                </Typography>
                {!loading ? 
                <CheckCircleOutlineIcon fontSize="large" sx={{color: 'green'}} /> 
                : <Loader />}
            </Stack>
            
            <Stack alignItems='center' >
                <Card sx={{ p: 3, width: 400, maxWidth: '95%'}}>
                    <form >
                        <Stack spacing={3}>
                            <Typography variant="h6" gutterBottom>
                                Cover du club
                            </Typography>

                            <Stack alignItems='center' >
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        alt="ClubCover"
                                        src={club?.cover_url}
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
                            multiple={false}
                            onChange={(e) => setCover(e.target.files[0])}/>

                            <Divider />

                            <TextField
                                name="description" 
                                label="Description du club" 								
                                value={club?.description}
                                // onBlur={handleUpdate}
                            />
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </Container>
    );
}

export default ClubManagement;