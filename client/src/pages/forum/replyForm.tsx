import { useState, ChangeEvent, FormEvent, FC } from 'react'
import { TextField, Stack, ListItem, Button, FormControl } from '@mui/material'
import { Comment, User } from '../../utils/types_interfaces'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'


type replyFormProps = {
    reply_to_id: string | undefined,
    submitReply: Function,
    focus: string
}

interface replyInputs {
    comment: string
}

const defaultReplyInput = {
    comment: ''
}

const ReplyForm: FC<replyFormProps> = ({ reply_to_id, submitReply, focus }) => {
    const [replyFormInput, setForm] = useState<replyInputs>(defaultReplyInput);
    const user = useSelector((state: RootState) => state.auth.user) as User

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target
        setForm({...replyFormInput, [name]: value})
    }

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const user_info = JSON.parse(localStorage.getItem('user') as string)
        const reply_comments = new Array<Comment>;
        const form_bus: Comment = {
            comment: replyFormInput.comment,
            author: user._id ? user._id.toString() : '',
            agree: 0,
            disagree: 0,
            replies: reply_comments,
        }
        if (reply_to_id === undefined) return
        else {
            if (focus === 'post') {
                form_bus.post_id = reply_to_id
            } else {
                form_bus.comment_to_id = reply_to_id
            }
        }
        submitReply(form_bus)
        setForm(defaultReplyInput)

    }
    return (
        <form onSubmit={e => {submitForm(e)}}>
            <Stack spacing={2}>
                <ListItem>
                    <FormControl fullWidth>
                        <TextField
                            variant="outlined"
                            name="comment"
                            label="Comment"
                            type="text"
                            value={replyFormInput.comment}
                            onChange={e => {handleInputChange(e)}} />
                    </FormControl>
                </ListItem>
                {/* <ListItem>
                    <TextField
                        variant="outlined"
                        name="author"
                        label="Author"
                        value={replyFormInput.author}
                        onChange={e => handleInputChange(e)} />
                </ListItem> */}
                <ListItem>
                    <Button variant="outlined"
                        type="submit">Submit</Button>
                </ListItem>
            </Stack>
            
                
        </form>
    )
}

export default ReplyForm;