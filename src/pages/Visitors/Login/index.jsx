import { 
	useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack, Card, Button } from '@mui/material';

import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../services/firebase';

  

const Login = () => {
	const navigate = useNavigate();
	const [ showPassword, setShowPassword ] = useState(false);

	const handleSignIn = async (event) => {
		event.preventDefault();
		const { email, password } = event.target.elements;

		try {
			await signInWithEmailAndPassword(auth, email.value, password.value);
			toast.success('Connexion réussie !');
		} catch (error) {
			toast.error(error.message);
		}
	}

	return(
		<Container sx={{height: '98vh'}} maxWidth="sm">
			<Stack sx={{height: '90%'}} alignItems="center" justifyContent="center">
				<Card sx={{ p: 3, width: 400, maxWidth: '95%'}}>
					<Typography variant="h4" gutterBottom>
					Connexion
					</Typography>
					<Typography variant="body2" sx={{ mb: 5 }}>
						Vous n'avez pas de compte ? {''}
					<LinkComponent onClick={() => navigate("/signup")} variant="subtitle2">Inscrivez-vous</LinkComponent>
					</Typography>
					<form onSubmit={handleSignIn}>
						<Stack spacing={3}>
							<TextField 
								name="email" 
								type="email"
								label="Adresse mail" 
							/>
							<TextField 
								name="password"
								label="Mot de passe"
								autoComplete="current-password"
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
							<p/>
							<LinkComponent onClick={() => navigate("/forgotpassword")} variant="subtitle2" underline='hover'>
								Mots de passe oublié ?
							</LinkComponent>
						</Stack>

						<Button variant="contained" type="submit" fullWidth>
							Connexion
						</Button>

					</form>
				</Card>
			</Stack>
	</Container>
			
	)
}

export default Login;
