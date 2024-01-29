import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom"
import Navigation from "./navigation"
import { Box, AppBar, Toolbar, IconButton, Drawer, Button } from "@mui/material";
import { Menu } from '@mui/icons-material'
import TopBar from "./topBar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/auth";

const drawerWidth = 250;
const MainLayout = () => {
    const {pathname} = useLocation()
    const [showDrawer, setShowDrawer] = useState(false)
    const logged_id = useSelector((state: RootState) => {return state.auth.is_logged_in})
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
    }
    return (
        <>
        <Box className="box-container">
            <AppBar position='fixed'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <Menu />
                    </IconButton>
                    <TopBar />
                    {logged_id && 
                    <Button color="inherit" onClick={logout_user}>Logout</Button> ||
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