import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REGEX } from '../../../config/config';

import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack, Button, Card } from '@mui/material';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../../services/firebase';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore/lite';


const Register = () => {
	const navigate = useNavigate();
	const [	showPassword, setShowPassword ] = useState(false);

	const [ user, setUser ] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password_confirmation: ""
	})

	const handleSignUp = async (event) => {
		event.preventDefault();
		const { email, password } = event.target.elements;
		try {
			const res = await createUserWithEmailAndPassword(auth, email.value, password.value);
			const docUser = await addDoc(collection(db, "users"), {
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				id: res.user.uid
			});
			if (docUser) {
				toast.success('Inscription réussie !');
				navigate(`/`);
			}
		} catch (error) {
			toast.error(error.message);
		}
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
		setUser( prevUser => {
			const { name, value } = event.target;
			return {
				...prevUser,
				[name]: value
			}
		})
	}

		
	return (
		<Container maxWidth="sm">
			<Card sx={{ p: 3}}>
				<Typography variant="h4" gutterBottom>
				Inscription
				</Typography>

				<Typography variant="body2" sx={{ mb: 5 }}>
				Vous avez déjà un compte ? {''}
						<LinkComponent onClick={() => navigate("/")} variant="subtitle2">Connectez-vous</LinkComponent>
				</Typography>

				<form className="" onSubmit={handleSignUp}>
					<Stack spacing={3}>
						<TextField 
							name="first_name" 
							label="Prénom" 								
							value={user.first_name}
							onChange={handleChange}
						/>
						<TextField 
							name="last_name" 
							label="Nom" 								
							value={user.last_name}
							onChange={handleChange}
						/>
						<TextField 
							name="email" 
							type="email"
							label="Adresse mail" 								
							value={user.email}
							onChange={handleChange}
						/>
						<TextField 
							name="password"
							label="Mot de passe"
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
						<Button variant='contained' disabled={!canBeSubmit()} type="submit">
							Inscription
						</Button>
					</Stack>
					
				</form>
			</Card>
		</Container>
	)
}

export default Register;