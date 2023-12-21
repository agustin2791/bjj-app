import { createSlice } from "@reduxjs/toolkit"

interface authState {
    user: Object,
    is_logged_in: boolean,
    last_login: string
}

const initialState: authState = {
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
            console.log('store user',action.payload, state)
            state.user = action.payload
            state.is_logged_in = true
            state.last_login = today.toDateString()
            console.log(state)
            // localStorage.setItem('auth', JSON.stringify(state))

        },
        logout: (state) => {
            state = initialState
            localStorage.clear()
        }
    }
})

export const { update_user, logout } = authReducer.actions
export default authReducer.reducer