import { useEffect, useState } from "react";
import { Button, Container, Divider, IconButton, LinearProgress, Stack, TextField, Typography } from "@mui/material"
import { Card, CardCover, CardContent } from '@mui/joy';

import { auth, db, storage } from '../../services/firebase';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { collection, addDoc, serverTimestamp} from "firebase/firestore";
import { AutoCompleteCities, Loader } from "../../components";
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const navigate = useNavigate();

    const [ event, setEvent ] = useState({
        club_id: auth.currentUser.uid,
        name: "",
        description: "",
        address: "",
        city: "",
        zipcode: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        cover_url: "",
        images: [],
    });

    const [ address, setAddress ] = useState();
	const [ cover, setCover ] = useState(null);
    const [ images, setImages ] = useState([]);
    const [ progress, setProgress ] = useState({
        cover: 0,
        images: []
    });

    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (address) {
            setEvent(prev => {
                return {
                    ...prev,
                    address: address.address,
                    city: address.city,
                    zipcode: address.zipcode
                }
            });
        }
    }, [address]);

    useEffect(() => {
        if (event.cover_url && event.images.length === images.length) {
            addDoc(collection(db, "events"), {
                ...event,
                created_at: serverTimestamp()
            })
            .then((e) => {
                toast.success('L\'événement a été créé avec succès');
                navigate(`/events/${e.id}`);
            })
        }
    }, [event, images, navigate]);

    const uploadCover = async () => {
        const storageRef = ref(storage, `events/covers/${event.name}`);
        const uploadTask = uploadBytesResumable(storageRef, cover);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(prev => {
                    return {
                        ...prev,
                        cover: progress
                    }
                });
            },
            (error) => {
                toast.error(error.message);
                setLoading(false);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setEvent(prev => {
                        return {
                            ...prev,
                            cover_url: downloadURL
                        }
                    }); 
                });
            }
        );
    };

    const uploadImages = async () => {
        images.forEach(async (image, index) => {
            const storageRef = ref(storage, `events/images/${event.name + "-" + index + 1}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(prev => {
                        let imagesProgress = prev.images;
                        imagesProgress[index] = progress;
                        return {
                            ...prev,
                            images: imagesProgress
                        }
                    });
                },
                (error) => {
                    toast.error(error.message);
                    setLoading(false);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setEvent(prev => {
                            return {
                                ...prev,
                                images: [...prev.images, downloadURL]
                            }
                        });
                    });
                }
            );
        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (event.start_date >= event.end_date) {
            toast.error('La date de fin doit être supérieure à la date de début');
            setLoading(false);
            return;
        }

        await uploadCover();

        await uploadImages();
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Créer un événement
            </Typography>
            <form>
                <Stack spacing={2} sx={{marginBottom: 2}}>
                    <Card sx={{ p: 2 }}>
                        <Stack spacing={4} sx={{ width: "100%" }}>
                            <Typography variant="h5" gutterBottom>
                                Informations générales
                            </Typography>

                            <TextField
                                label="Nom"
                                variant="outlined"
                                required
                                value={event.name}
                                onChange={(e) => setEvent(prev => {
                                    return {
                                        ...prev,
                                        name: e.target.value
                                    }
                                })}/>

                            <TextField
                                label="Sponsor"
                                variant="outlined"
                                required
                                value={event.sponsor}
                                onChange={(e) => setEvent(prev => {
                                    return {
                                        ...prev,
                                        sponsor: e.target.value
                                    }
                                })}/>

                            <TextField
                                label="Description"
                                variant="outlined"
                                required
                                type="text"
                                multiline
                                rows={4}
                                value={event.description}
                                onChange={(e) => setEvent(prev => {
                                    return {
                                        ...prev,
                                        description: e.target.value
                                    }
                                })}/>

                            <Divider />

                            <AutoCompleteCities setAddress={setAddress} />

                            <TextField
                                    label="Adresse"
                                    variant="outlined"
                                    required
                                    value={event.address}
                                    onChange={(e) => setEvent(prev => {
                                        return {
                                            ...prev,
                                            address: e.target.value
                                        }})}/>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between' spacing={2}>
                                <TextField
                                    label="Ville"
                                    required
                                    variant="outlined"
                                    fullWidth
                                    value={event.city}
                                    onChange={(e) => setEvent(prev => {
                                        return {
                                            ...prev,
                                            city: e.target.value
                                        }})}/>

                                <TextField
                                    type='number'
                                    label="Code postal"
                                    required
                                    variant="outlined"
                                    fullWidth
                                    value={event.zipcode}
                                    onChange={(e) => setEvent(prev => {
                                        return {
                                            ...prev,
                                            zipcode: e.target.value
                                        }})}/>
                            </Stack>

                            <Divider />

                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between' spacing={2}>
                                <TextField
                                    label="Date de début"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={event.start_date}
                                    onChange={(e) => setEvent(prev => {
                                        return {
                                            ...prev,
                                            start_date: e.target.value
                                        }})}/>
                                        
                                <TextField
                                    label="Date de fin"
                                    type="date"
                                    required
                                    variant="outlined"
                                    fullWidth
                                    value={event.end_date}
                                    onChange={(e) => setEvent(prev => {
                                        return {
                                            ...prev,
                                            end_date: e.target.value
                                        }})}/>
                            </Stack>

                        </Stack>
                    </Card>

                    <Card sx={{ p: 2 }}>
                        <Stack spacing={2} sx={{ width: "100%" }}>
                            <Typography variant="h5" gutterBottom>
                                Images
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                Ajoutez une couverture pour votre événement (une vidéo ou une image)
                            </Typography>
                            
                            { cover && <Card component="li" sx={{ width: 300 }}>
                                <CardCover>
                                    {cover.type === "video/mp4" ? 
                                    <video autoPlay loop muted >
                                        <source src={ URL.createObjectURL(cover) } type="video/mp4" />
                                    </video>: 
                                    <img src={ URL.createObjectURL(cover) } alt="cover" /> }
                                </CardCover>
                                <CardContent>
                                    <Typography
                                        sx={{ color: 'white', height: 30}}
                                        mt={{ xs: 12, sm: 18 }}
                                    >
                                        { event.name }
                                    </Typography>
                                    { progress.cover !== 0 && <LinearProgress sx={{bottom: 2}} variant="determinate" value={progress.cover} />}
                                </CardContent>
                            </Card>}
                            
                            <Stack alignItems='flex-end'>
                                <input
                                type="file"
                                accept="image/jpeg, image/png, video/mp4"
                                required
                                multiple={false}
                                onChange={(e) => setCover(e.target.files[0])}/>
                            </Stack>

                            <Typography variant="body1" gutterBottom>
                                Ajoutez des images pour votre événement
                            </Typography>

                            <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
                                {images.length > 0 && images.map((image, index) => (
                                    <Card key={index} sx={{ width: 300, height: 180 }}>
                                        <CardCover>
                                            <img src={ URL.createObjectURL(image) } alt={`${index}`} />
                                        </CardCover>
                                        <Stack alignItems='flex-end' sx={{height: '100%', zIndex: 1}}>
                                        { (progress.images[index] || 0) !== 0 ? 
                                            <Stack sx={{ width: '100%' }} >
                                                <LinearProgress variant="determinate" value={progress.images[index] || 0} />
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
                                                    setImages(prev => prev.filter((img, imgIndex) => imgIndex !== index));
                                                }
                                            }}>
                                                <ClearIcon />
                                            </IconButton>}
                                        </Stack>
                                        
                                    </Card>
                                ))}
							</Stack> 
                            
                            <Stack alignItems='flex-end'>
                                <input
                                type="file"
                                accept="image/jpeg, image/png"
                                required
                                multiple={true}
                                onChange={(e) => {
                                    for (let i = 0; i < e.target.files.length; i++) {
                                        setImages(prev => {
                                            return [...prev, e.target.files[i]]
                                        });
                                    }}}/>
                            </Stack>

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

export default CreateEvent;