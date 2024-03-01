import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REGEX } from '../../../config/config';

import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack, Button, Card, Avatar, Box, CircularProgress } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../../../services/firebase';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore/lite';


const Register = () => {
	const navigate = useNavigate();
	const [	showPassword, setShowPassword ] = useState(false);
	const [ image, setImage ] = useState(null);
    const [ updated, setUpdated ] = useState(true);
	const [ progress, setProgress ] = useState(0);


	const [ user, setUser ] = useState({
		id: "",
		displayName: "",
		photoURL: "",
		email: "",
		password: "",
		password_confirmation: ""
	})

	useEffect(() => {
		if (image) {
			setUpdated(false);
			const storageRef = ref(storage, `clubs/avatars/${image.name}`);
			const uploadTask = uploadBytesResumable(storageRef, image);
			
			uploadTask.on('state_changed', 
				(snapshot) => {
					setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
						setUpdated(true);
					});
				}
			);
		}
	}, [image])

	const handleSignUp = async (event) => {
		event.preventDefault();
		
		setUpdated(false);
		
		createUserWithEmailAndPassword(auth, user.email, user.password)
		.then(async (userCredential) => {
			await addDoc(collection(db, "clubs"), {
				user_id: userCredential.user.uid,
				name: user.displayName,
				photo_url: user.photoURL,
				email: user.email,
				created_at: serverTimestamp()
			});

			await updateProfile(userCredential.user, {
				displayName: user.displayName,
				photoURL: user.photoURL
			});
		})
		.catch((error) => {
			toast.error(error.message);
			setUpdated(true);
		})
		.finally(() => {
			setUpdated(true);
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
	  return (checkEmailFormat() && checkPasswordsFormat() && user?.photoURL) ? true : false
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
				<Card sx={{ p: 3, width: 400, maxWidth: '95%'}}>
					<Typography variant="h4" gutterBottom>
						Inscription
					</Typography>

					<Typography variant="body2" sx={{ mb: 3 }}>
						Vous avez déjà un compte ? {''}
						<LinkComponent onClick={() => navigate("/")} variant="subtitle2">Connectez-vous</LinkComponent>
					</Typography>

					<form className="" onSubmit={handleSignUp}>
						<Stack spacing={3} sx={{width: '100%'}}>
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
							required
							multiple={false}
							onChange={(e) => setImage(e.target.files[0])}/>

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

						<Stack alignItems="center" sx={{ my: 2 }}>
							<Button variant='contained' disabled={!canBeSubmit() || !updated} type="submit">
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