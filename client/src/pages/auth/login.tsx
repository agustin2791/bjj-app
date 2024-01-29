import { useState, ChangeEvent, FormEvent } from 'react';
import { getData } from './../../utils/data-utils';
import FormInput from './../../components/form-input/form-input';
import { useDispatch } from 'react-redux';
import { update_user } from '../../store/auth';
import { Grid, Stack, Paper, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// import './Login.css';

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
const Login = () => {
  // hooks
    const [user, setUser] = useState<User | null>()
    const [formFields, setFormFields] = useState(defaultFormFields)
    const navigate = useNavigate()
    const { username, password } = formFields
    const dispatch = useDispatch();

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
        dispatch(update_user(res.user))
        setUser(res.user);
        resetFormFields()
        localStorage.setItem('accessToken', res.token)
        navigate('/')
      } catch (error) {
        alert('User Sign In failed')
      }
    };

    const reload = () => {
      setUser(null);
      resetFormFields()
    };

    return (
      <Stack className='auth_container'>
        <Paper sx={{padding: '20px'}}>
          <Grid container className="card">
            <Grid item sm={12}>
              <Typography variant="h3" sx={{textAlign: 'center'}}>Login</Typography>
              <br />
              <form onSubmit={(e) => handleSubmit(e)}>
                <TextField
                  label="username"
                  type="text"
                  required
                  name="username"
                  value={username}
                  fullWidth
                  onChange={handleChange}
                />
                <br /><br />
                <TextField
                  label="Password"
                  type='password'
                  required
                  name='password'
                  value={password}
                  fullWidth
                  onChange={handleChange}
                />
                <div className="button-group">
                  <Button type="submit" variant="contained">Sign In</Button>
                  {/* <Button type="button"  variant="contained" onClick={reload}>Clear</Button> */}
                </div>
                <div className="login-disclaimer">
                  Not Registered? <a href="/register">Register here</a>
                </div>
              </form>
            </Grid>
            
          </Grid>
        </Paper>
        
      </Stack>
    );
}

export default Login;
