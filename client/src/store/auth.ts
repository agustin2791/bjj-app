import { createSlice } from "@reduxjs/toolkit"

interface authState {
    token: string,
    refresh_token: string,
    user: Object,
    is_logged_in: boolean,
    last_login: string
}

const initialState: authState = {
    token: '',
    refresh_token: '',
    user: {},
    is_logged_in: false,
    last_login: ''
}

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        update_user: (state, action) => {
            let today = new Date()
            state = {
                ...state,
                user: action.payload,
                is_logged_in: true,
                last_login: today.getDate().toString()
            }
            localStorage.setItem('auth', JSON.stringify(state))
        },
        update_token: (state, action) => {
            state = {
                ...state,
                token: action.payload.token,
                refresh_token: action.payload.refresh_token
            }
            localStorage.setItem('auth', JSON.stringify(state))
        },
        logout: (state) => {
            state = initialState
            localStorage.clear()
        }
    }
})

export const { update_user, update_token, logout} = authReducer.actions
export default authReducer.reducer