import { createSlice } from "@reduxjs/toolkit";

interface dashboardState {
    fav: boolean;
    kuralNum: number;
    kuralData: any[];
    favKuralData: any[];
    bgTheme: string;
    loading: boolean;
    openSetting: boolean;
    openInfo: boolean;
}

const initialState: dashboardState = {
    fav: false,
    kuralNum: 1,
    kuralData: [],
    favKuralData: [],
    bgTheme: 'StarBg',
    loading: false,
    openSetting: false,
    openInfo: false,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setFav: (state, actions) => {
            state.fav = actions.payload;
        },
        setKuralNum: (state, actions) => {
            state.kuralNum = actions.payload
        },
        setKuralData: (state, actions) => {
            state.kuralData = actions.payload
        },
        appendKuralData: (state, actions) => {
            state.kuralData = [...state.kuralData, actions.payload];
        },
        setFavKuralData: (state, actions) => {
            state.favKuralData = actions.payload
        },
        appendFavKuralData: (state, actions) => {
            state.favKuralData = [...state.favKuralData, actions.payload];
        },
        removeFavKuralData: (state, action) => {
            state.favKuralData = state.favKuralData.filter(item => item.number !== action.payload);
        },
        clearFavKuralData: (state) => {
            state.favKuralData = [];
        },
        setBgTheme: (state, actions) => {
            state.bgTheme = actions.payload
        },
        setLoading: (state, actions) => {
            state.loading = actions.payload
        },
        setOpenSetting: (state, actions) => {
            state.openSetting = actions.payload
        },
        setOpenInfo: (state, actions) => {
            state.openInfo = actions.payload
        },
    }
});
export const { setFav, setKuralNum, setKuralData, clearFavKuralData,
    appendKuralData, setFavKuralData, appendFavKuralData, setBgTheme, setLoading, setOpenInfo, setOpenSetting, removeFavKuralData } = dashboardSlice.actions;
export default dashboardSlice.reducer;