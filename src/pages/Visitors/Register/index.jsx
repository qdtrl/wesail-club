import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import useResponsive from '../../../hooks/useResponsive';
import { REGEX } from '../../../config/config';

import { styled } from '@mui/material/styles';
import { Link as LinkComponent, Container, Typography, TextField, IconButton, InputAdornment, Stack, Button } from '@mui/material';
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

const Register = () => {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [	canBeSubmit, setCanBeSubmit ] = useState(false);
	const [	showPassword, setShowPassword ] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState(null);
	const mdUp = useResponsive('up', 'md');

	const [userCreate, setUserCreate ] = useState(
    { 
      firstname: "",
      lastname: "",
      email: "",
	  avatar: "",
      password: "",
	  passwordConfirmation: ""
    }
  )
	
	useEffect(() => {
		if (user.isLogged) {
			navigate('/');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const { responseData, post} = useFetch();
	
	useEffect(() => {
		if (responseData && !responseData?.errors) {
			toast.success("Votre compte a bien été créé, veuillez patienter pendant que nous validons votre compte.");
			navigate('/');
		}
		if (responseData?.errors)
			responseData.errors.forEach(error => toast.error(error));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [responseData])

	const checkEmailFormat = () => {		
		return  userCreate.email.match(REGEX) ? true : false
	}

	const checkPasswordsFormat = () => {
		const { password, passwordConfirmation } = userCreate;
		if(password.length > 6 && password === passwordConfirmation)
			return true
		else
			return false
	}
	
	useEffect(() => {	
		if(checkEmailFormat() && checkPasswordsFormat()) 
			setCanBeSubmit(true);
		else
			setCanBeSubmit(false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userCreate])

	const handleSubmit = (event) => {
		event.preventDefault();	
		let fieldBookFormData = new FormData()
		for (let prop in userCreate) {
			if (Object.prototype.hasOwnProperty.call(userCreate, prop)) {
				if (userCreate[prop]) {
					fieldBookFormData.append(`users[${prop}]`, userCreate[prop])
				}
			}
		}

		post('users', fieldBookFormData, false);
		}
	
	const handleChange = (event) => {
		setUserCreate( prevUserData => {
		const { name, value } = event.target;
		return {
			...prevUserData,
			[name]: value
		}
		})
	}

	const handleAvatarChange = (event) => {
		const file = event.target.files[0];
		setUserCreate( prevUserData => {
			return {
				...prevUserData,
				avatar: file
			}
		})
		setAvatarUrl(URL.createObjectURL(file));
	}

	const handleAvatarDelete = () => {
		setUserCreate( prevUserData => {
			return {
				...prevUserData,
				avatar: []
			}
		})
		setAvatarUrl(null);
	}
		
	return (
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
							Inscription
							</Typography>
							<Typography variant="body2" sx={{ mb: 5 }}>
							Vous avez déjà un compte ? {''}
									<LinkComponent onClick={() => navigate("/")} variant="subtitle2">Connectez-vous</LinkComponent>
							</Typography>
								<form className="" onSubmit={handleSubmit}>
									<Stack spacing={3}>
										<TextField 
											name="firstname" 
											label="Prénom" 								
											value={userCreate.firstname}
											onChange={handleChange}
										/>
										<TextField 
											name="lastname" 
											label="Nom" 								
											value={userCreate.lastname}
											onChange={handleChange}
										/>
										<TextField 
											name="email" 
											type="email"
											label="Adresse mail" 								
											value={userCreate.email}
											onChange={handleChange}
										/>
										<TextField 
											name="password"
											label="Mot de passe"
											value={userCreate.password}
											autoComplete="new-password"
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
										<TextField 
											name="passwordConfirmation"
											label="Confirmation du mot de passe"
											value={userCreate.passwordConfirmation}
											autoComplete="new-password"
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
										<div style={{width: "100%"}}>
											<Typography variant='p'>Photo de profil: </Typography>
											{ avatarUrl && 
												<Stack direction='row' justifyContent='space-between' alignItems='center' marginBottom={2}>
													<img src={avatarUrl} alt="avatar" style={{width: "80px"}}/>
													<Button onClick={handleAvatarDelete}>
														<img alt='delete' style={{width:'20px'}} src='/assets/icons/ic_trash-can.png'/>
													</Button>
												</Stack>}
											<input type="file" accept="image/*" name='images' multiple={false} onChange={handleAvatarChange} />	
										</div>
									</Stack>
									<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
										<p></p>
									</Stack>
									<LoadingButton fullWidth size="large" type="submit" disabled={!canBeSubmit} variant="contained">
										Inscription
									</LoadingButton>
								</form>
						</StyledContent>
					</Container>
				</StyledRoot>
			</>
	)
}

export default Register;