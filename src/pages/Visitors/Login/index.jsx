import { 
	useEffect,
	useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import useResponsive from '../../../hooks/useResponsive';

import { LOGIN } from '../../../stores/actions';

import { styled } from '@mui/material/styles';
import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

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
  

const Login = () => {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const mdUp = useResponsive('up', 'md');
	const [ showPassword, setShowPassword ] = useState(false);
	const [ userLogin, setUserLogin ] = useState({
		email: "",
		password: ""
	})	

	useEffect(() => {
		if (user.isLogged) {
			toast.success('Connexion réussie !');
			navigate(`/`);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const { responseData, token, post } = useFetch();

	useEffect(() => {
		if (responseData && !responseData.error) {
			toast.success('Connexion réussie !');
			dispatch({ type: LOGIN, data: responseData, token });
		}
		if (responseData?.error) {
			toast.error(responseData?.error);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [responseData]);

	const handleLogin = (event) => {
		event.preventDefault();

		post('auth/login', userLogin );
	}

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
						Connexion
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
											<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
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

							<LoadingButton fullWidth size="large" type="submit" variant="contained">
								Connexion
							</LoadingButton>
						</form>
					</StyledContent>
				</Container>
			</StyledRoot>
		</>
	)
}

export default Login;
