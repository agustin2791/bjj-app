import { useState, ChangeEvent, FormEvent } from 'react';
import { ReactComponent as Logo } from "./logo.svg";
import { getData } from './utils/data-utils';
import FormInput from './components/form-input/form-input';

import './App.css';

type User = {
  id: number,
  name: string,
  username: string,
  password: string
}

type LoginReturn = {
  token: string,
  user: User
}
const defaultFormFields = {
  username: '',
  password: ''
}
const App = () => {
  // hooks
    const [user, setUser] = useState<User | null>()
    const [formFields, setFormFields] = useState(defaultFormFields)
    const { username, password } = formFields

    const resetFormFields = () => {
      return (
        setFormFields(defaultFormFields)
      );
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
        const res: LoginReturn = await getData(
          'http://localhost:8000/auth/login', username, password
        )
        setUser(res.user);
        resetFormFields()
        localStorage.setItem('accessToken', res.token)
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
          { user && `Welcome ${user.name}` }
        </h1>
        <div className="card">
          <Logo className="logo" />
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="username"
              type="text"
              required
              name="username"
              value={username}
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
    );
}

export default App;
