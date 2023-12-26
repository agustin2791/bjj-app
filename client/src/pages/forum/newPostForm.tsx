import { InputHTMLAttributes, FC, useState, useEffect, ChangeEvent } from "react";
import { Button, TextField, ListItem, Select, MenuItem, Autocomplete, AutocompleteRenderInputParams, Box } from "@mui/material";
import Stack from '@mui/material/Stack'
import { getChannelsByChar } from "../../utils/forum-utils";
import { Channel } from "../../utils/types_interfaces";

type newPostForm = {
    title: string,
    author: string,
    description: string,
    channel: string,
    handleInputChange: Function,
    submitPost: Function,
    has_channel: boolean
}
interface ChannelOptions {
    label: string,
    value: string,
    fullWidth: boolean
}
const NewPost: FC<newPostForm> = ( {title, author, description, handleInputChange, submitPost, channel, has_channel }) => {
    const [channelList, setChannelList] = useState<Array<ChannelOptions>>([])

    useEffect(() => {
        findChannel()
    }, [channel])

    const findChannel = async () => {
        console.log('looking for channel')
        const list = await getChannelsByChar(channel) as Channel[]
        if (Array.isArray(list)) {
            setChannelList(list.map((l) => {return {label: l.category, value: l._id, fullWidth: true}}))
        } else {
            setChannelList([])
        }
    }

    const selectChannel = (event: any) => {
        try {
            if(!event.target) return
            const {value} = event.target
            handleInputChange(event)
            let new_value = channelList.filter(c => c.label === value)[0]['value']
            event.target.value = new_value
            event.target.name = 'channel_id'
            handleInputChange(event)
        } catch (e) {
            return
        }
        
    }

    return (
        <form onSubmit={e => {submitPost(e)}}>
            <Stack spacing={2}>
                <h3>New Post</h3>
                <ListItem>
                    <TextField 
                        variant="outlined"
                        label="Title"
                        fullWidth={true} 
                        name="title" 
                        value={title} 
                        onChange={e => {handleInputChange(e)}} />
                </ListItem>
                <ListItem>
                    <Box sx={{width: '45%'}}>
                        <Autocomplete
                            disablePortal
                            readOnly={has_channel}
                            options={channelList}
                            fullWidth={true}
                            autoComplete
                            onSelect={(e) => {selectChannel(e)}}
                            renderInput={(params: AutocompleteRenderInputParams) => {return (<TextField
                                label="Channel"
                                type="Select"
                                name="channel"
                                required
                                value={channel}
                                {...params}
                                onChange={e => {selectChannel(e)}}>
                            </TextField>)}} />
                            <br />
                            {channel}
                        
                    </Box>
                    <Box sx={{width: '50%', marginLeft: 'auto'}}>
                        <TextField 
                            variant="outlined"
                            fullWidth={true} 
                            name="author" 
                            value={author}
                            disabled
                            onChange={e => {handleInputChange(e)}} />
                    </Box>
                </ListItem>
                <ListItem>
                    <TextField 
                        variant="outlined"
                        label="Description"
                        fullWidth={true}
                        multiline 
                        name="description" 
                        rows={4} 
                        value={description} 
                        onChange={e => {handleInputChange(e)}} />
                </ListItem>
                <ListItem>
                    <Button variant="contained" color="primary" type="submit">Post</Button>
                </ListItem>
            </Stack>
        </form>
    )
}

export default NewPost;