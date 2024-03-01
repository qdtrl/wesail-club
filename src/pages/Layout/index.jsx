import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Groups2Icon from '@mui/icons-material/Groups2';
import SettingsIcon from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useState } from 'react';
import { Dialog } from '../../components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { API_URL } from '../../config/config';

const AccountMenu = ({ children }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openLogOut, setOpenLogOut] = useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setOpenLogOut(false);
            toast.success('Déconnexion réussie !');
            navigate(`/`);
            // Utilisateur déconnecté, vous pouvez rediriger vers la page de connexion
        } catch (error) {
            toast.error(error.message);
        }
    };
    

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' , alignItems: 'center', textAlign: 'center', borderBottom:  1, marginBottom: '1rem', borderColor: 'divider', bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
                <IconButton
                    onClick={() => navigate('/')}
                    size="small"
                    sx={{ ml: 2 }} >
                    <Avatar sx={{ width: 50, height: 50 }} src={`${API_URL}assets/images/logo.png`} alt="we-sail-club-logo" />
                </IconButton>

                <Typography 
                    sx={{
                        minWidth: 100,
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                    onClick={() => navigate('/events')}>
                    Événements
                </Typography>

                <Typography 
                    sx={{
                        minWidth: 100,
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                    onClick={() => navigate('/conversations')}>
                    Conversations
                </Typography>
                
                <Typography 
                    sx={{
                        minWidth: 100,
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                    onClick={() => navigate('/clubs')}>
                        Clubs
                </Typography>
                
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 50, height: 50 }} src={auth.currentUser.photoURL} alt={auth.currentUser.displayName} />
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                    },
                    '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    },
                },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    navigate(`/dashboard/club-management`);
                }}>
                    <ListItemIcon>
                        <Groups2Icon fontSize="small" />
                    </ListItemIcon>
                    Club
                </MenuItem>

                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    navigate(`/dashboard/account`);
                }}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Compte
                </MenuItem>

                <Divider />
                
                <MenuItem onClick={() => setOpenLogOut(true)}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{color: 'red'}} />
                    </ListItemIcon>
                    Déconnexion
                </MenuItem>
            </Menu>
            
            <Dialog
            open={openLogOut}
            setOpen={setOpenLogOut}
            handleCancel={handleSignOut}
            title="Déconnexion"
            content={`Êtes-vous sûr de vouloir vous déconnecter ?`} />
            
            {children}


        </React.Fragment>
    );
}

export default AccountMenu;