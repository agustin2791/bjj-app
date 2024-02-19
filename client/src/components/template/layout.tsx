import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom"
import Navigation from "./navigation"
import { Box, AppBar, Toolbar, IconButton, Drawer, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material'
import TopBar from "./topBar";
import { useEffect, useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/auth";
import ProfilePicture from "../profile/picture";
import { User } from "../../utils/types_interfaces";

const drawerWidth = 250;
const MainLayout = () => {
    const {pathname} = useLocation()
    const [showDrawer, setShowDrawer] = useState(false)
    const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const logged_id = useSelector((state: RootState) => {return state.auth.is_logged_in})
    const profile = useSelector((state: RootState) => state.auth.profile)
    const user = useSelector((state: RootState) => state.auth.user) as User
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(function () {
        console.log(pathname, ' pathname')
        setShowDrawer(pathname === '/' || pathname.includes('posts'))
    }, [pathname])

    const navigateTo = (nav: string) => {
        return navigate(nav)
    }
    const logout_user = () => {
        dispatch(logout())
        navigate('/')
    }

    const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
        setProfileMenuAnchor(event.currentTarget)
        setProfileMenuOpen(true)
    }

    const closeProfileMenu = () => {
        setProfileMenuOpen(false)
    }
    return (
        <>
        <Box className="box-container">
            <AppBar position='fixed'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <TopBar />
                    {logged_id && 
                    <>
                        <Button onClick={handleProfileClick} color='navBtn'> 
                                <Avatar sx={{margin: '0 5px', bgcolor: '#333'}} src={profile?.image ? profile.image : ''}>
                                    {!profile?.image && <AccountCircle />}
                                </Avatar>
                                
                            {user?.username}
                        </Button>
                        <Menu anchorEl={profileMenuAnchor}
                            open={profileMenuOpen}
                            onClose={closeProfileMenu}>
                                <MenuItem onClick={() => {navigateTo(`/profile/${user?.username}`)}}>View Profile</MenuItem>
                                <MenuItem onClick={() => {navigateTo(`/profile/edit/${user?.username}`)}}>Edit Profile</MenuItem>
                                <MenuItem onClick={logout_user}>Logout</MenuItem>
                        </Menu>
                        {/* <Button color="inherit" onClick={logout_user}>Logout</Button>  */}
                    </> ||
                    <>
                        <Button color="inherit" onClick={() => {navigateTo('/login')}}>Login</Button>
                        <Button color="inherit" onClick={() => {navigateTo('/register')}}>Register</Button>
                    </>}
                </Toolbar>
            </AppBar>
            {showDrawer && <Navigation />}
            <Box className="box-item-3 main-content">
                <Outlet />
            </Box>  
        </Box>
            
        </>
    )
}

export default MainLayout;