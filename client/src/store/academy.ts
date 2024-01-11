import { createSlice } from "@reduxjs/toolkit"

interface academyState {
    details: Object
}

const initialState: academyState = {
    details: {}
}

const academyReducer = createSlice({
    name: 'academy',
    initialState,
    reducers: {
        update_details: (state, action) => {
            state.details = action.payload
            let today = new Date()
            console.log(state)

        },
        
    }
})

export const { update_details } = academyReducer.actions
export default academyReducer.reducer