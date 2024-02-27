import { 
	useEffect,
	useState } from 'react';

import { useNavigate } from 'react-router-dom';


import { Link as LinkComponent, Container, Typography, TextField, Stack } from '@mui/material';

import { toast } from 'react-toastify';

  

const ForgotPassword = () => {
	const [ email, setEmail ] = useState("")	
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (user.isLogged) {
	// 		toast.success('Connexion réussie !');
	// 		navigate(`/`);
	// 	}
	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [user])


	const handleLogin = (event) => {
		event.preventDefault();
	}

	return(

	<Container maxWidth="sm">
			<Typography variant="h4" gutterBottom>
			Mot de passe oublié
			</Typography>
			<Typography variant="body2" sx={{ mb: 5 }}>
				Vous n'avez pas de compte ? {''}
					<LinkComponent onClick={() => navigate("/signup")} variant="subtitle2">Inscrivez-vous</LinkComponent>
			</Typography>
			<form className="" onSubmit={handleLogin}>
				<Stack spacing={3}>
					<TextField 
						name="email" 
						type="email"
						label="Adresse mail" 								
						value={email}
						onChange={(e) => setEmail(e.target.value.toLowerCase())}
					/>
				</Stack>
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
					<p></p>
					<LinkComponent onClick={() => navigate("/")} variant="subtitle2" underline='hover'>Connectez-vous</LinkComponent>
				</Stack>

				
			</form>
	</Container>
	)
}

export default ForgotPassword;
