import {createSlice} from '@reduxjs/toolkit';

export const loggedUserSlice = createSlice({
    name: 'loggedUser',
    initialState: {
        value: null
    },
    reducers: {
        setLoggedUser: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const {setLoggedUser} = loggedUserSlice.actions;

export default loggedUserSlice.reducer;