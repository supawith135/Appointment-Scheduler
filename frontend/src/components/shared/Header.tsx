import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import sutLogoWhite from '../../assets/ENGi Lettermark-EN-White.png';
import { useNavigate } from 'react-router-dom';
import { UsersInterface } from '../../interfaces/IUsers';
import { GetStudentById } from '../../services/https/student/student';
import { GetTeacherById } from '../../services/https/teacher/teacher';
import { GetAdminById } from '../../services/https/admin/admin';

function ResponsiveAppBar() {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [userData, setUserData] = React.useState<UsersInterface | null>(null);
    const navigate = useNavigate();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const getUserById = async (id: string) => {
        const role = localStorage.getItem("role");
        try {
            let res;
            if (role === 'student') {
                res = await GetStudentById(id);
            } else if (role === 'teacher') {
                res = await GetTeacherById(id);
            } else if (role === 'admin') {
                res = await GetAdminById(id);
            }

            if (res && res.status === 200) {
                setUserData(res.data.data);
            } else {
                console.error("Error getting user data: ", res.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const id = String(localStorage.getItem('id'));
    React.useEffect(() => {
        getUserById(id);
    }, [id]);

    const settings = ['Profile', 'Account', 'Logout'];

    const handleMenuClick = (setting: string) => {
        if (setting === 'Logout') {
            handleLogout();
        } else {
            const role = localStorage.getItem("role");
            const baseRoute = role === 'student' ? '/Student' : role === 'teacher' ? '/Teacher' : '/Admin';
            navigate(`${baseRoute}/${setting}`);
            handleCloseUserMenu();
        }
    };

    return (
        <AppBar position="static" sx={{ background: "#800020", height: { xs: '60px', sm: '70px' }, padding: '0 8px' }}>
            <div >
            <Toolbar sx={{ minHeight: { xs: '60px', sm: '70px' } }}> {/* ปรับความสูงของ Toolbar */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        // href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <img
                            src={sutLogoWhite}
                            alt='sutLogoWhite'
                            className='max-w-40 ml-10'
                            onClick={() => {
                                const role = localStorage.getItem("role");
                                const baseRoute = role === 'student' ? '/Student' : role === 'teacher' ? '/Teacher' : '/Admin';
                                navigate(baseRoute);
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </Typography>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        // href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <img
                            src={sutLogoWhite}
                            alt='sutLogoWhite'
                            className='max-w-48 ml-10'
                            onClick={() => {
                                const role = localStorage.getItem("role");
                                const baseRoute = role === 'student' ? '/Student' : role === 'teacher' ? '/Teacher' : '/Admin';
                                navigate(baseRoute);
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <div className='text-white font-bold text-xl mr-2'>
                            {userData?.user_name} - {userData?.position?.position_name || ''} {userData?.full_name} 
                        </div>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src={userData?.image} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src={userData?.image} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                    <div className='mr-6'></div>
                </Toolbar>
                
            </div>
        </AppBar>
    );
}

export default ResponsiveAppBar;