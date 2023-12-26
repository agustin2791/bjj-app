import { Button, FormControl, TextField } from "@mui/material"
import { ChangeEvent, FormEvent, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { User } from "../../utils/types_interfaces"
import { CreateChannel } from "../../utils/forum-utils"
import { redirect, useNavigate } from "react-router-dom"

interface IChannel {
    category: string,
    slug: string,
    top: boolean
}

interface newChannelInputs {
    category: string
}
const defaultChannelForm: newChannelInputs = {
    category: ''
}
const NewChannelForm = () => {
    const [newChannel, setNewChannel] = useState<newChannelInputs>(defaultChannelForm);
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user) as User

    const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target
        console.log(name, value)
        setNewChannel({...newChannel, [name]: value})
    }

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('submit channel')
        
        const user_id = user._id ? user._id.toString() : ''
        try {
            const new_channel = await CreateChannel(newChannel.category, user_id) as IChannel
            if (new_channel.slug) {
                // navigate()
                return redirect(`/posts/${new_channel.slug}`)
            } else {
                console.log('channel already exists')
            }
        } catch (e) {
            console.log('this is an error')
            console.log(e)
            return
        }
        
    }

    return (
        <form onSubmit={(e) =>submitForm(e)} style={{textAlign: 'center'}}>
            <h3>New Channel Community</h3>
            <FormControl>
                <TextField 
                    label="Channel"
                    name="category"
                    type="text"
                    value={newChannel.category}
                    onChange={(e) => {handleFormChange(e)}} />
            </FormControl>
            <br /><br />
            {newChannel.category}
            <Button type="submit" variant="outlined">Submit</Button>
        </form>
    )
}

export default NewChannelForm;