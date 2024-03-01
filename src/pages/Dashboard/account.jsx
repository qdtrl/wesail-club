import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../services/firebase";
import { toast } from "react-toastify";
import { Avatar, Box, Card, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Loader } from "../../components";

const Account = () => {
    const [ updated, setUpdated ] = useState(true);

	const [ user, setUser ] = useState(auth.currentUser);
    const [ image, setImage ] = useState(null);
    const [ progress, setProgress ] = useState(0);


    const handleUpload = (e) => {
        const storageRef = ref(storage, `users/avatars/${e.name}`);
        const uploadTask = uploadBytesResumable(storageRef, e);
    
        uploadTask.on('state_changed', 
            (snapshot) => {
                console.log(snapshot.bytesTransferred, snapshot.totalBytes);
            }, 
            (error) => {
                toast.error(error.message);
                setUpdated(true);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUser(prev => {
                        return {
                            ...prev,
                            photoURL: downloadURL
                        }
                    });
                });
            }
        );
    };

    const handleUpdate = async (event) => {
        event.preventDefault();   
    }

    return (
    <Container maxWidth="sm">
        <Card sx={{ p: 3, width: 400, maxWidth: '95%'}}>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Typography variant="h4" gutterBottom>
                    Modifier les informations du club
                </Typography>
                {updated ? 
                <CheckCircleOutlineIcon fontSize="large" sx={{color: 'green'}} /> 
                : <Loader />}
            </Stack>
            <form >
                <Stack spacing={3}>
                    <Stack alignItems='center' >
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                alt="ClubAvatar"
                                src={user.photoURL}
                                sx={{ width: 100, height: 100, zIndex: 1}}
                            />
                            { !updated && (
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

                    <TextField
                        name="name" 
                        label="Nom du club" 								
                        value={user.displayName}
                        onBlur={handleUpdate}
                    />
                </Stack>
            </form>
        </Card>
    </Container>
    )
}

export default Account;