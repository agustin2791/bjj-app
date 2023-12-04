import { InputHTMLAttributes, FC } from "react";
import { Button, TextField, ListItem } from "@mui/material";
import Stack from '@mui/material/Stack'

type newPostForm = {
    title: string,
    author: string,
    description: string,
    handleInputChange: Function,
    submitPost: Function
}
const NewPost: FC<newPostForm> = ( {title, author, description, handleInputChange, submitPost }) => {

    return (
        <form onSubmit={e => {submitPost(e)}}>
            <Stack spacing={2}>
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
                    <TextField 
                        variant="outlined" 
                        label="Author"
                        fullWidth={true} 
                        name="author" 
                        value={author} 
                        onChange={e => {handleInputChange(e)}} />
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