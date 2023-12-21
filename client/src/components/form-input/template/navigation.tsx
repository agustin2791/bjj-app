import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Box, Drawer, IconButton, List, SwipeableDrawer, Toolbar, ListItem, Button } from "@mui/material";
import { Menu } from '@mui/icons-material'

const navigation_links = [
    {
        name: 'Home',
        dir: '/',
        login: false
    },
    {
        name: 'Top',
        dir: '/posts',
        login: false
    },
    // {
    //     name: 'Your Feed',
    //     dir: '/feed',
    //     login: true
    // },
    // {
    //     name: 'Events',
    //     dir: '/events',
    //     login: false
    // },
    // {
    //     name: 'Find Academy',
    //     dir: '/find-academy',
    //     login: false
    // },
    // {
    //     name: 'Tournaments',
    //     dir: '/tournaments',
    //     login: false
    // }
]
const Navigation = () => {
    const [nav, setNav] = useState(navigation_links)
    const [viewDrawer, setViewDrawer] = useState(true)
    const navigate = useNavigate()

    const NavTo = (to:string) => {
        // window.location.href = to
        navigate(to, {replace: true})
    }
    
    return (
        <Box className="box-item left-drawer">
                <List>
                    {nav.map((n, index) => (
                        <ListItem key={index}>
                            <Link to={n.dir}>{n.name}</Link>
                        </ListItem>
                    ))}
                </List>
        </Box>
                
    )
}

export default Navigation;