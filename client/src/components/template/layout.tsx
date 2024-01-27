import { Outlet, Route, Routes, useLocation, useParams } from "react-router-dom"
import Navigation from "./navigation"
import { Box, AppBar, Toolbar, IconButton, Drawer } from "@mui/material";
import { Menu } from '@mui/icons-material'
import TopBar from "./topBar";
import { useEffect, useState } from "react";

const drawerWidth = 250;
const MainLayout = () => {
    const {pathname} = useLocation()
    const [showDrawer, setShowDrawer] = useState(false)
    useEffect(function () {
        console.log(pathname, ' pathname')
        setShowDrawer(pathname === '/' || pathname.includes('posts'))
    }, [pathname])
    return (
        <>
        <Box className="box-container">
            <AppBar position='fixed'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <Menu />
                    </IconButton>
                    <TopBar />
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