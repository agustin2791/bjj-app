import { useState, ChangeEvent, FormEvent } from 'react';
import { ReactComponent as Logo } from "../../logo.svg";
import { registerUser } from '../../utils/data-utils';
import FormInput from '../../components/form-input/form-input';

type User = {
    username: string,
    email: string,
    password: string
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
            const res: User = await registerUser(
                'http://localhost:8000/auth/register', username, email, password
            )
            setUser(res);
            resetFormFields()
        } catch (error) {
            alert('User Sign In failed')
        }
    };
    const reload = () => {
        setUser(null);
        resetFormFields()
    };

    return (
        <div className='App-header'>
            <h1>
                { user && `Welcome ${user.username}` }
            </h1>
            <div className="card">
                <Logo className="logo" />
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Username"
                        type="username"
                        required
                        name="username"
                        value={username}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        required
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Password"
                        type='password'
                        required
                        name='password'
                        value={password}
                        onChange={handleChange}
                    />
                    <div className="button-group">
                    <button type="submit">Sign In</button>
                    <span>
                        <button type="button" onClick={reload}>Clear</button>
                    </span>
                    </div>
                </form>
            </div>
      </div>
    )
}

export default Registration;