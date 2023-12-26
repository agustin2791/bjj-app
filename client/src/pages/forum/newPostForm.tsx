import { InputHTMLAttributes, FC, useState, useEffect, ChangeEvent } from "react";
import { Button, TextField, ListItem, Select, MenuItem, Autocomplete, AutocompleteRenderInputParams, Box, Switch, FormControl } from "@mui/material";
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
    has_channel: boolean,
    embedded?: boolean
    embedded_type?: string,
    embedded_link?: string
}
interface ChannelOptions {
    label: string,
    value: string,
    fullWidth: boolean
}
const NewPost: FC<newPostForm> = ( {title,
    author,
    description,
    handleInputChange,
    submitPost,
    channel,
    has_channel,
    embedded = false, 
    embedded_type = '',
    embedded_link = ''
}) => {
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

    const selectembedded = (event: any) => {
        try {
            event.target.value = event.target.checked
            event.target.name = 'embedded'
            handleInputChange(event)
        } catch (e) {
            console.log(e)
            return
        }
    }

    const selectembeddedType = (event: any) => {
        try {
            event.target.name = 'embedded_type'
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
                    {!has_channel && <Box sx={{width: '45%'}}>
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
                        
                    </Box>}
                    {has_channel && <div><b>Channel: </b>{channel}</div>}
                </ListItem>
                <ListItem>
                    <Box sx={{width: '130px'}}>
                        <b>Add a link?</b><br /><Switch value={embedded} onChange={e => {selectembedded(e)}} arai-label="Add a link" />
                    </Box>
                    {embedded && <>
                    <Box sx={{width: '45%', paddingRight: '15px'}}>
                        <Select
                            name="embedded_type"
                            fullWidth={true}
                            value={embedded_type}
                            onChange={e => {selectembeddedType(e)}}
                        >
                            <MenuItem value="link">External link</MenuItem>
                            <MenuItem value="video">Video (YouTube)</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{width: '50%'}}>
                        <TextField
                            fullWidth={true}
                            label="Media Link"
                            name="embedded_link"
                            value={embedded_link}
                            onChange={e => {handleInputChange(e)}}></TextField>
                    </Box>
                    </>}
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