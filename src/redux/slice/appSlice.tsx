import { createSlice } from "@reduxjs/toolkit";

interface appState {
    launchedApp: string | null;
}

const initialState: appState = {
    launchedApp: null,
};

const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setLaunchedApp: (state, actions) => {
            state.launchedApp = actions.payload;
        },
    }
});
export const { setLaunchedApp } = appSlice.actions;
export default appSlice.reducer;