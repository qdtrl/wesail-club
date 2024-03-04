import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../services/firebase";
import { toast } from "react-toastify";
import { Avatar, Box, Card, CircularProgress, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Loader } from "../../components";

const Account = () => {
    const [ loading, setLoading ] = useState(false);

	const [ user, setUser ] = useState(auth.currentUser);
    const [ image, setImage ] = useState(null);
    const [ progress, setProgress ] = useState(0);

    const handleUpload = (e) => {
        const storageRef = ref(storage, `clubs/icons/${e.name}`);
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
                    setUser(prev => {
                        return {
                            ...prev,
                            photoURL: downloadURL
                        }
                    });
                    setLoading(false);
                });
            }
        );
    };

    useEffect(() => {
        if (image) {
            setLoading(true);
            handleUpload(image);
        }
    }, [image]);

    const handleUpdate = async (event) => {
        event.preventDefault();   
    }

    return (
    <Container >
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Typography variant="h4" gutterBottom>
                Modifier les informations du compte
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
                            Icône du club
                        </Typography>

                        <Stack alignItems='center' >
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    alt="ClubAvatar"
                                    src={user.photoURL}
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
                        onChange={(e) => setImage(e.target.files[0])}/>

                        <Divider />

                        <TextField
                            name="displayName" 
                            label="Nom du club" 								
                            value={user.displayName}
                            onBlur={handleUpdate}
                        />
                    </Stack>
                </form>
            </Card>
        </Stack>
    </Container>
    )
}

export default Account;