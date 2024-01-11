import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Box, Drawer, IconButton, List, SwipeableDrawer, Toolbar, ListItem, Button, Modal } from "@mui/material";
import { Menu } from '@mui/icons-material'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/auth";
import NewChannelForm from "../../pages/forum/newChannelForm";

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
    const [newChannel, setNewChannel] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const is_logged_in:boolean = useSelector((state: RootState) => state.auth.is_logged_in)

    const NavTo = (to:string) => {
        // window.location.href = to
        navigate(to, {replace: true})
    }

    const toggleNewChannel = () => {
        setNewChannel(!newChannel)
    }
    const Logout = () => {
        dispatch(logout())
    }
    
    return (
        <Box className="box-item left-drawer">
                <List>
                    {is_logged_in && 
                        <>
                            <Button onClick={toggleNewChannel} color="primary">Create New Channel</Button>
                            <Modal open={newChannel} onClose={toggleNewChannel}>
                                <Box className="modal"><NewChannelForm /></Box>
                            </Modal>
                        </>
                    }
                    {nav.map((n, index) => (
                        <ListItem key={index}>
                            <Link to={n.dir}>{n.name}</Link>
                        </ListItem>
                    ))}
                    {is_logged_in && 
                    <ListItem>
                        <Button color="error" onClick={() => Logout()}>Logout</Button>
                    </ListItem>}
                </List>

        </Box>
                
    )
}

export default Navigation;