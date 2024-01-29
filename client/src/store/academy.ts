import { createSlice } from "@reduxjs/toolkit"

interface academyState {
    details: Object,
    academiesSubscribed: [Object],
    myAcademies: [Object]
}

const initialState: academyState = {
    details: {},
    academiesSubscribed: [{}],
    myAcademies: [{}]
}

const academyReducer = createSlice({
    name: 'academy',
    initialState,
    reducers: {
        update_details: (state, action) => {
            state.details = action.payload
            let today = new Date()

        },
        set_subscribed_academies: (state, action) => {
            state.academiesSubscribed = action.payload
        },
        set_my_academies: (state, action) => {
            state.myAcademies = action.payload
        }
        
    }
})

export const { update_details, set_subscribed_academies, set_my_academies } = academyReducer.actions
export default academyReducer.reducer