import { 
	useEffect,
	useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack } from '@mui/material';

import { toast } from 'react-toastify';

  

const Login = () => {
	const navigate = useNavigate();

	const [ showPassword, setShowPassword ] = useState(false);
	const [ userLogin, setUserLogin ] = useState({
		email: "",
		password: ""
	})	

	// useEffect(() => {
	// 	if (true) {
	// 		toast.success('Connexion réussie !');
	// 		navigate(`/`);
	// 	}
	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [user])


	

	const handleChange = (event) => {
		event.preventDefault();
		setUserLogin( prevUserLogin => {
			const { name, value } = event.target;
			return {
				...prevUserLogin,
				[name]: value
			}
		})
	}

	return(

	<Container maxWidth="sm">
			<Typography variant="h4" gutterBottom>
			Connexion
			</Typography>
			<Typography variant="body2" sx={{ mb: 5 }}>
			Vous n'avez pas de compte ? {''}
					<LinkComponent onClick={() => navigate("/signup")} variant="subtitle2">Inscrivez-vous</LinkComponent>
			</Typography>
			<form  >
				<Stack spacing={3}>
					<TextField 
						name="email" 
						type="email"
						label="Adresse mail" 								
						value={userLogin.email}
						onChange={handleChange}
					/>
					<TextField 
						name="password"
						label="Mot de passe"
						value={userLogin.password}
						autoComplete="current-password"
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
					<p></p>
					<LinkComponent onClick={() => navigate("/forgotpassword")} variant="subtitle2" underline='hover'>
					Mots de passe oublié ?
					</LinkComponent>
				</Stack>

			</form>
	</Container>
			
	)
}

export default Login;
