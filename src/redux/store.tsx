import { combineReducers, legacy_createStore as createStore } from 'redux';
import dashboardSlice from './slice/dashboardSlice';
import appSlice from './slice/appSlice';

const rootReducer = combineReducers({
    dashboard: dashboardSlice,
    appSlice: appSlice,
});
export const store = createStore(rootReducer);
export type RootState = ReturnType<typeof rootReducer>;