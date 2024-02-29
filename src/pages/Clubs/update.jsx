import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../services/firebase";
import { toast } from "react-toastify";
import { Avatar, Card, Stack, TextField, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Loader } from "../../components";

const UpdateClub = () => {
    const [ updated, setUpdated ] = useState(true);

	const [ user, setUser ] = useState({
        id: "",
        displayName: "",
		photoURL: "",
		email: "",
		phoneNumber: "",
	})

    useEffect(() => {
        console.log(auth);
    }, [])


    const handleUpload = (e) => {
        const storageRef = ref(storage, `users/avatars/${e.name}`);
        const uploadTask = uploadBytesResumable(storageRef, e);
    
        uploadTask.on('state_changed', 
            (snapshot) => {
                console.log(snapshot.bytesTransferred, snapshot.totalBytes);
            }, 
            (error) => {
                toast.error(error.message);
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
        <Card sx={{ p: 3, width: 400, maxWidth: '95%'}}>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Typography variant="h4" gutterBottom>
                    Modifier les informations du club
                </Typography>
                {updated ? <Loader /> : <CheckCircleOutlineIcon color="green" />}
            </Stack>
            <form >
                <Stack spacing={3}>
                    <Avatar
                        alt="Club"
                        src={user.photoURL}
                        sx={{ width: 100, height: 100 }}
                    />
                    <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => handleUpload(e.target.files[0])}/>

                    <TextField
                        name="name" 
                        label="Nom du club" 								
                        value={user.displayName}
                        onBlur={handleUpdate}
                    />
                </Stack>
            </form>
        </Card>
    )
}

export default UpdateClub;