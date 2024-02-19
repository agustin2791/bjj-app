import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Box, Drawer, IconButton, List, SwipeableDrawer, Toolbar, ListItem, Button, Modal } from "@mui/material";
import { Menu } from '@mui/icons-material'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/auth";
import NewChannelForm from "../../pages/forum/newChannelForm";
import { Channel } from "../../utils/types_interfaces";
import { GetDefaultChannels } from "../../utils/forum-utils";

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
    const [sortedChannels, setSortedChannels] = useState<Channel[]>()
    const [defaultChannels, setDefaultChannels] = useState<Channel[]>()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const is_logged_in:boolean = useSelector((state: RootState) => state.auth.is_logged_in)
    const profile = useSelector((state: RootState) => state.auth.profile)

    useEffect(function() {
        if (profile && profile.channel_subs) {
            let sorted = [...profile.channel_subs]
            sorted = sorted.sort((a, b) => {
                if (a.category > b.category) {return 1}
                else if (a.category < b.category) {return -1}
                return 0
            })
            setSortedChannels(sorted)
        } else {
            getDefaultChannel()
        }
    }, [profile])

    const toggleNewChannel = () => {
        setNewChannel(!newChannel)
    }
    
    const getDefaultChannel = async () => {
        let channels = await GetDefaultChannels() as Channel[]
        let sorted = channels.sort((a, b) => {
            if (a.category > b.category) return 1
            if (a.category < b.category) return -1
            return 0
        })
        setSortedChannels(sorted)
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
                    {sortedChannels && sortedChannels.map(s => {
                        return (
                            <ListItem key={s._id}>
                                <Link to={`/posts/${s.slug}`}>{s.category}</Link>
                            </ListItem>
                        )
                    })}
                </List>

        </Box>
                
    )
}

export default Navigation;