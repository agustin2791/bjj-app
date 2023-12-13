import { useState, ChangeEvent, FormEvent, FC } from 'react'
import { TextField, Stack, ListItem, Button } from '@mui/material'
import { Comment } from '../../utils/types_interfaces'


type replyFormProps = {
    reply_to_id: number | undefined,
    submitReply: Function
}

interface replyInputs {
    author: string,
    comment: string
}

const defaultReplyInput = {
    author: '',
    comment: ''
}

const ReplyForm: FC<replyFormProps> = ({ reply_to_id, submitReply }) => {
    const [replyFormInput, setForm] = useState<replyInputs>(defaultReplyInput);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target
        setForm({...replyFormInput, [name]: value})
    }

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const reply_comments = new Array<Comment>;
        const form_bus: Comment = {
            comment: replyFormInput.comment,
            author: replyFormInput.author,
            agree: 0,
            disagree: 0,
            replies: reply_comments,
            comment_to_id: reply_to_id
        }
        submitReply(form_bus)
        setForm(defaultReplyInput)

    }
    return (
        <form onSubmit={e => {submitForm(e)}}>
            <Stack spacing={2}>
                <ListItem>
                    <TextField
                        variant="outlined"
                        name="comment"
                        label="Comment"
                        type="text"
                        value={replyFormInput.comment}
                        onChange={e => {handleInputChange(e)}} />
                </ListItem>
                <ListItem>
                    <TextField
                        variant="outlined"
                        name="author"
                        label="Author"
                        value={replyFormInput.author}
                        onChange={e => handleInputChange(e)} />
                </ListItem>
                <ListItem>
                    <Button variant="outlined"
                        type="submit">Submit</Button>
                </ListItem>
            </Stack>
            
                
        </form>
    )
}

export default ReplyForm;