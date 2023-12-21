import { Outlet, Route, Routes } from "react-router-dom"
import Navigation from "./navigation"
import { Box, AppBar, Toolbar, IconButton, Drawer } from "@mui/material";
import { Menu } from '@mui/icons-material'

const drawerWidth = 250;
const MainLayout = () => {
    return (
        <>
        <Box className="box-container">
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Navigation />
            <Box className="box-item-3">
                <Outlet />
            </Box>  
        </Box>
            
        </>
    )
}

export default MainLayout;