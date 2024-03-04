import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REGEX } from '../../../config/config';
import { Card, CardCover, CardContent } from '@mui/joy';

import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack, Button, Avatar, Box, CircularProgress, LinearProgress, Divider } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../../../services/firebase';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


const Register = () => {
	const navigate = useNavigate();
	const [	showPassword, setShowPassword ] = useState(false);
	const [ icon, setIcon ] = useState(null);
	const [ cover, setCover ] = useState(null);
    const [ loading, setLoading ] = useState(false);
	const [ progress, setProgress ] = useState({
		icon: 0,
		cover: 0
	});


	const [ user, setUser ] = useState({
		id: "",
		displayName: "",
		icon_url: "",
		cover_url: "",
		email: "",
		password: "",
		password_confirmation: ""
	})

	useEffect(() => {
		if (icon) {
			setLoading(true);
			const storageRef = ref(storage, `clubs/icons/${icon.name}`);
			const uploadTask = uploadBytesResumable(storageRef, icon);
			
			uploadTask.on('state_changed', 
				(snapshot) => {
					setProgress({...progress, icon: (snapshot.bytesTransferred / snapshot.totalBytes) * 100});
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
								icon_url: downloadURL
							}
						});
						setLoading(false);
					});
				}
			);
		}
		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [icon])

	useEffect(() => {
		if (cover) {
			setLoading(true);
			const storageRef = ref(storage, `clubs/covers/${cover.name}`);
			const uploadTask = uploadBytesResumable(storageRef, cover);
			
			uploadTask.on('state_changed', 
				(snapshot) => {
					setProgress({...progress, cover: (snapshot.bytesTransferred / snapshot.totalBytes) * 100});
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
								cover_url: downloadURL
							}
						});
						setLoading(false);
					});
				}
			);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cover])

	const handleSignUp = async (event) => {
		event.preventDefault();
		
		setLoading(true);
		
		createUserWithEmailAndPassword(auth, user.email, user.password)
		.then(async (userCredential) => {
			const clubRef = doc(db, "clubs", userCredential.user.uid);

			await setDoc(clubRef, {
				name: user.displayName,
				cover_url: user.cover_url,
				email: user.email,
				created_at: serverTimestamp()
			});

			await updateProfile(userCredential.user, {
				displayName: user.displayName,
				photoURL: user.icon_url
			});
		})
		.catch((error) => {
			toast.error(error.message);
			setLoading(true);
		})
		.finally(() => {
			setLoading(true);
			toast.success(`Inscription réussie ${user.displayName}!`);
			navigate(`/`);
		});
	};
	
	const checkEmailFormat = () => {		
		return  user.email.match(REGEX) ? true : false
	}

	const checkPasswordsFormat = () => {
		const { password, password_confirmation } = user;
		return (password.length > 6 && (password === password_confirmation)) ? true : false
	}
	
	const canBeSubmit = () => {
	  return (checkEmailFormat() && checkPasswordsFormat() && user.icon_url && user.cover_url) ? true : false
	}

	const handleChange = (event) => {
		event.preventDefault();
		setUser( prev => {
			const { name, value } = event.target;
			return {
				...prev,
				[name]: value
			}
		})
	}
		
	return (
		<Container sx={{height: '98vh'}} maxWidth="sm">
			<Stack sx={{height: '90%'}} alignItems="center" justifyContent="center">
				<Card sx={{ p: 0, width: 400, maxWidth: '95%'}}>
					<form className="" onSubmit={handleSignUp}>
						<Stack spacing={3} sx={{width: '100%'}}>
							<Stack>
								<Card component="li" >
									{ cover && 
									<CardCover sx={{ backgroundColor: 'black'}}>
										<img src={ URL.createObjectURL(cover) } alt="cover" style={{opacity: 0.4}}/>
									</CardCover>}

									<CardContent sx={{ color: cover ? 'white' : 'black' }}>
										<Typography variant="h4" gutterBottom >
											Inscription
										</Typography>

										<Typography variant="body2" sx={{ mb: 3 }}>
											Vous avez déjà un compte ? {''}
											<LinkComponent onClick={() => navigate("/")} variant="subtitle2">Connectez-vous</LinkComponent>
										</Typography>
										<Stack alignItems='center' >
											<Box sx={{ position: 'relative' }}>
												<Avatar
													alt="ClubAvatar"
													src={icon ? URL.createObjectURL(icon) : ""}
													sx={{ width: 100, height: 100, zIndex: 1}}
												/>
												{ (progress.icon !== 0 && progress.icon !== 100) && (
												<CircularProgress
													variant="determinate"
													value={progress.icon}
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
										<Typography sx={{ color: 'white', height: 30}} >
											{ user.displayName }
										</Typography>
									</CardContent>
								</Card>
								{ (progress.cover !== 0 && progress.cover !== 100)  ? <LinearProgress sx={{bottom: 2}} variant="determinate" value={progress.cover} /> : <div style={{height: 4}}></div>}
							</Stack>
							
							<Stack pl={2} pr={2} spacing={2}>
								<label htmlFor="icon">Icône</label>
								<input
								label="Icon"
								type="file"
								accept="image/*"
								required
								multiple={false}
								onChange={(e) => setIcon(e.target.files[0])}/>

								<label htmlFor="cover">Couverture</label>
								<input
								label="Cover"
								type="file"
								accept="image/*"
								required
								multiple={false}
								onChange={(e) => setCover(e.target.files[0])}/>

								<Divider />

								<TextField 
									name="displayName" 
									label="Nom du club" 
									required								
									value={user.displayName}
									onChange={handleChange}
								/>

								<TextField 
									name="email" 
									type="email"
									required
									label="Adresse mail" 								
									value={user.email}
									onChange={handleChange}
								/>

								<TextField 
									name="password"
									label="Mot de passe"
									required
									value={user.password}
									autoComplete="new-password"
									onChange={handleChange}
									type={showPassword ? 'text' : 'password'}
									InputProps={{
										endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
											</IconButton>
										</InputAdornment>
									),
								}}/>

								<TextField 
									name="password_confirmation"
									label="Confirmation du mot de passe"
									required
									value={user.password_confirmation}
									autoComplete="new-password"
									onChange={handleChange}
									type={showPassword ? 'text' : 'password'}
									InputProps={{
										endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
											</IconButton>
										</InputAdornment>
									),
								}}/>
			
							</Stack>
						
						</Stack>

						<Stack alignItems="center" sx={{ my: 2 }}>
							<Button variant='contained' disabled={!canBeSubmit() || loading} type="submit">
								Inscription
							</Button>
						</Stack>
						
					</form>
				</Card>
			</Stack>
		</Container>
	)
}

export default Register;