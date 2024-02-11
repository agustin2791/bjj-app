import { createSlice } from "@reduxjs/toolkit"
import { Profile } from "../utils/types_interfaces"

interface authState {
    user: Object,
    is_logged_in: boolean,
    last_login: string,
    profile: Profile
}

const initialState: authState = {
    user: {},
    is_logged_in: false,
    last_login: '',
    profile: {} as Profile
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
        set_profile: (state, action) => {
            state.profile = action.payload as Profile
        },
        logout: (state) => {
            state.user = initialState.user
            state.is_logged_in = initialState.is_logged_in
            state.last_login = initialState.last_login
            localStorage.clear()
        }
    }
})

export const { update_user, logout, set_profile } = authReducer.actions
export default authReducer.reducer