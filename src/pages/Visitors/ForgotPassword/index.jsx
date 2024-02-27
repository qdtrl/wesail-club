import { 
	useEffect,
	useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import useResponsive from '../../../hooks/useResponsive';


import { styled } from '@mui/material/styles';
import { Link as LinkComponent, Container, Typography, TextField, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { toast } from 'react-toastify';

const StyledRoot = styled('div')(({ theme }) => ({
	[theme.breakpoints.up('md')]: {
	  display: 'flex',
	},
  }));
  
  const StyledSection = styled('div')(({ theme }) => ({
	width: '100%',
	maxWidth: 480,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	boxShadow: theme.customShadows.card,
	backgroundColor: "#444444",
	color: "white"
  }));
  
  const StyledContent = styled('div')(({ theme }) => ({
	maxWidth: 480,
	margin: 'auto',
	minHeight: '100vh',
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	padding: theme.spacing(12, 0),
  }));
  

const ForgotPassword = () => {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const mdUp = useResponsive('up', 'md');
	const [ email, setEmail ] = useState("")	

	useEffect(() => {
		if (user.isLogged) {
			toast.success('Connexion réussie !');
			navigate(`/`);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const { isLoading, responseData, post } = useFetch();

	useEffect(() => {
		if (responseData && !responseData.error) {
			toast.success(responseData.message);
            navigate(`/`);
		}
		if (responseData?.error) {
			toast.error(responseData?.error);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [responseData]);

	const handleLogin = (event) => {
		event.preventDefault();

		post('auth/forgot_password', { email } );
	}

	return(
		<>
			<StyledRoot>
				{mdUp && (
				<StyledSection>
					<Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
					Réseaux Plus
					</Typography>
					<img src="/assets/logo-OCR.png" alt="login" />
				</StyledSection>
				)}
				<Container maxWidth="sm">
					<StyledContent>
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
                                <LinkComponent onClick={() => navigate("/login")} variant="subtitle2" underline='hover'>Connectez-vous</LinkComponent>
							</Stack>

							<LoadingButton disabled={isLoading} fullWidth size="large" type="submit" variant="contained">
								Réinitialiser 
							</LoadingButton>
						</form>
					</StyledContent>
				</Container>
			</StyledRoot>
		</>
	)
}

export default ForgotPassword;
