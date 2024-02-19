import { InputHTMLAttributes, FC, useState, useEffect, ChangeEvent } from "react";
import { Button, TextField, ListItem, Select, MenuItem, Autocomplete, AutocompleteRenderInputParams, Box, Switch, FormControl, styled, Grid, ImageList, ImageListItem, Fab } from "@mui/material";
import Stack from '@mui/material/Stack'
import { getChannelsByChar } from "../../utils/forum-utils";
import { Channel } from "../../utils/types_interfaces";
import { CloudUpload, Remove } from "@mui/icons-material";

type newPostForm = {
    title: string,
    author: string,
    description: string,
    channel: string,
    handleInputChange: Function,
    removeImage: Function,
    images?: File[],
    submitPost: Function,
    has_channel: boolean,
    embedded?: boolean
    embedded_type?: string,
    embedded_link?: string,
    has_images?: boolean,
    nsfw: boolean
}
interface ChannelOptions {
    label: string,
    value: string,
    fullWidth: boolean
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
    multiple: true
})

const max_images = 10;

const NewPost: FC<newPostForm> = ( {title,
    author,
    description,
    handleInputChange,
    removeImage,
    submitPost,
    channel,
    has_channel,
    embedded = false, 
    embedded_type = '',
    embedded_link = '',
    has_images = false,
    images = [],
    nsfw = false
}) => {
    const [channelList, setChannelList] = useState<Array<ChannelOptions>>([])
    const [displayImages, setDisplayImages] = useState<string[]>([])
    const [allowUpload, setAllowUpload] = useState(true)

    useEffect(() => {
        findChannel()
    }, [channel])

    useEffect(() => {
        console.log(images)
        if (images.length > 0)
            showDisplayImages()
    }, [images])

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

    const selectHaveImages = (event: any) => {
        try {
            event.target.name = 'has_images'
            event.target.value = event.target.checked
            handleInputChange(event)
        } catch (e) {
            return
        }
    }

    const toggleBooleanField = (event: any, target_name: string) => {
        try {
            event.target.name = target_name
            event.target.value = event.target.checked
            handleInputChange(event)
        } catch (e) {
            return
        }
    }

    const showDisplayImages = () => {
        let show_images = images.map(i => {
            return URL.createObjectURL(i)
        }) as string[]
        setDisplayImages(show_images ? show_images : [] as string[])
        setAllowUpload(images.length < max_images)
    }

    const rmvImage = (idx: number) => {
        removeImage(idx)
        if (idx === 0) {
            setDisplayImages([])
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
                    <Grid container alignItems={'stretch'}>
                        <Grid item>
                            <Switch value={nsfw} onChange={(e) => {toggleBooleanField(e, 'nsfw')}} aria-label="NSFW" />
                        </Grid>
                        <Grid item alignSelf={'center'} justifySelf={'center'}>
                            NSFW? - Check this field if the post contains graphic content this includes: nudity, gore (lots of blood), or anything you would feel unconfertable opening professional work setting.
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    <Grid container>
                        <Grid item sm={1}>
                            <b>Add Images?</b><br />
                            <Switch value={has_images} onChange={(e) => {selectHaveImages(e)}} aria-label="Add Images" />
                        </Grid>
                        <Grid item sm={2}>
                        {has_images && 
                            <Button component="label" variant="contained" startIcon={<CloudUpload />} disabled={!allowUpload}>
                                Upload Image
                                <VisuallyHiddenInput type="file" name="images" onChange={(e) => {handleInputChange(e)}} />
                            </Button>}
                        {has_images && 
                        <div>{displayImages.length}/{max_images} Max</div>}
                        </Grid>
                        <Grid item sm={9}>
                            <ImageList sx={{maxHeight: '250px'}} cols={4} rowHeight={150}>
                                {displayImages.map((i, index) => {
                                    return (
                                        <ImageListItem key={index} sx={{position: 'relative'}}>
                                            <Fab aria-label="remove" size="small" onClick={() => {rmvImage(index)}} sx={{position: 'absolute', top: 10, right: 10}}>
                                                <Remove />
                                            </Fab>
                                            <img src={i} alt={'image preview ' + (index + 1)} loading="lazy" />
                                        </ImageListItem>
                                    )
                                })}
                            </ImageList>
                        </Grid>
                    </Grid>
                    
                    
                </ListItem>
                <ListItem>
                    <Box sx={{width: '130px'}}>
                        <b>Add a link?</b><br /><Switch value={embedded} onChange={e => {selectembedded(e)}} aria-label="Add a link" />
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