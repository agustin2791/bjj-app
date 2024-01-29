import { useState, ChangeEvent, FormEvent } from 'react';
import { ReactComponent as Logo } from "../../logo.svg";
import { registerUser } from '../../utils/data-utils';
import FormInput from '../../components/form-input/form-input';
import { Button, Stack, TextField, Typography } from '@mui/material';
import SlotCard from '../../components/template/card';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { update_user } from '../../store/auth';
import { User } from '../../utils/types_interfaces';

type LoginReturn = {
    token: string,
    user: User
  }
const defaultFormFields = {
    username: '',
    email: '',
    password: ''
}

const Registration = () => {
    // hooks
    const [user, setUser] = useState<User | null>()
    const [formFields, setFormFields] = useState(defaultFormFields)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { username, email, password } = formFields

    const resetFormFields = () => {
        return (
            setFormFields(defaultFormFields)
        )
    }

    // input changes
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setFormFields({...formFields, [name]: value})
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            // make api call
            const res: LoginReturn = await registerUser(
                'http://localhost:8000/auth/register', username, email, password
            )
            console.log('res')
            dispatch(update_user(res.user))
            setUser(res.user);
            resetFormFields()
            navigate('/')
        } catch (error) {
            alert('User Registration failed')
        }
    };
    const reload = () => {
        setUser(null);
        resetFormFields()
    };

    return (
        <Stack className='auth_container'>
            <SlotCard>
                <Typography variant="h3" sx={{textAlign: 'center'}}>Register</Typography><br />
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        type="username"
                        required
                        fullWidth
                        name="username"
                        value={username}
                        onChange={handleChange}
                    /><br /><br />
                    <TextField
                        label="Email"
                        type="email"
                        required
                        fullWidth
                        name="email"
                        value={email}
                        onChange={handleChange}
                    /><br /><br />
                    <TextField
                        label="Password"
                        type='password'
                        required
                        fullWidth
                        name='password'
                        value={password}
                        onChange={handleChange}
                    />
                    <div className="button-group">
                        <Button type="submit" variant="contained">Register</Button>
                        <Button type="button" onClick={reload}>Clear</Button>
                    </div>
                    <div className="login-disclaimer">
                        Already have an account? <a href="/login">Login here</a>
                    </div>
                </form>
            </SlotCard>
      </Stack>
    )
}

export default Registration;