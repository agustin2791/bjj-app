import { Box, Button, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";

type nav_links = {
    label: string,
    path: string,
    contains: string
}

const links: nav_links[] = [
    {label: 'Posts', path: '/', contains: 'post'},
    {label: 'Academies', path: '/academy', contains: 'academy'},
    {label: 'Tournaments', path: '/tournaments', contains: 'tournaments'},
    {label: 'Events', path: '/events', contains: 'events'}
]

const TopBar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [navs, setNavs] = useState(links)
    // const [current, setCurrent] = useState(location)
    
    // useEffect(() => {
    //     setCurrent(location)
    // }, ['location'])





    const navigateTo = (path: string) => {
        console.log('navigating to:', path)
        return navigate(path)
    }
    return (
        <Box sx={{ flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {navs.map(n => {
                return (
                    <Button 
                        className={`top-bar-nav-links`}
                        key={n.label}
                        color="navBtn" 
                        onClick={() => {navigateTo(n.path)}} 
                        variant={location.pathname === '/' && n.contains === 'post' ? 'outlined' : location.pathname.includes(n.contains) ? 'outlined' : 'text'}>{n.label}</Button>
                )
            })}
            
        </Box>
    )
}

export default TopBar;