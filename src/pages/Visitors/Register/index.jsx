import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REGEX } from '../../../config/config';

import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack, Button, Card, Avatar } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from '../../../services/firebase';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Loader } from '../../../components';


const Register = () => {
	const navigate = useNavigate();
	const [	showPassword, setShowPassword ] = useState(false);
	const [ image, setImage ] = useState(null);
    const [ updated, setUpdated ] = useState(true);


	const [ user, setUser ] = useState({
		id: "",
		displayName: "",
		photoURL: "",
		email: "",
		phoneNumber: "",
		password: "",
		password_confirmation: ""
	})

	const handleSignUp = async (event) => {
		event.preventDefault();
		
		setUpdated(false);
		
		createUserWithEmailAndPassword(auth, user.email, user.password)
		.then(async (userCredential) => {
			console.log('userCredential', userCredential);
			setUser(prev => {
				return {
					...prev,
					id: userCredential.user.uid
				}
			});
		})
		.then(async () => {
			const storageRef = ref(storage, `users/avatars/${image.name}`);
			const uploadTask = uploadBytesResumable(storageRef, image);
			
			uploadTask.on('state_changed', 
				(snapshot) => {
					console.log(snapshot.bytesTransferred, snapshot.totalBytes);
				}, 
				(error) => {
					toast.error(error.message);
				}, 
				async () => {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
					setUser(prev => {
						return {
							...prev,
							photoURL: downloadURL
						}
					});
			});
		})
		.then(async () => {
			console.log('user', user);
			updateProfile(auth.currentUser, {
				displayName: user.displayName,
				photoURL: user.photoURL,
				phoneNumber: user.phoneNumber
			});
		})
		.then(() => {
			setUpdated(true);
			toast.success('Inscription réussie !');
			navigate(`/`);
		})
		.catch((error) => {
			toast.error(error.message);
		})
	};
	
	const checkEmailFormat = () => {		
		return  user.email.match(REGEX) ? true : false
	}

	const checkPasswordsFormat = () => {
		const { password, password_confirmation } = user;
		return (password.length > 6 && (password === password_confirmation)) ? true : false
	}
	
	const canBeSubmit = () => {
	  return (checkEmailFormat() && checkPasswordsFormat()) ? true : false
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

					<Typography variant="body2" sx={{ mb: 5 }}>
						Vous avez déjà un compte ? {''}
						<LinkComponent onClick={() => navigate("/")} variant="subtitle2">Connectez-vous</LinkComponent>
					</Typography>

					<form className="" onSubmit={handleSignUp}>
						<Stack spacing={3} sx={{width: '100%'}}>
							<Stack alignItems='center' >
								<Avatar
									alt="ClubAvatar"
									src={image ? URL.createObjectURL(image) : ""}
									sx={{ width: 100, height: 100 }}
								/>
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
								type='tel'
								name="phoneNumber"
								required
								label="Numéro de téléphone"
								value={user.phoneNumber}
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
						<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
							{updated ? <Button variant='contained' disabled={!canBeSubmit()} type="submit">
								Inscription
							</Button> : <Loader />}
						</Stack>
						
					</form>
				</Card>
			</Stack>
		</Container>
	)
}

export default Register;