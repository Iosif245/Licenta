import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth-reducer';
import { Location, NavigateFunction } from 'react-router-dom';
import userReducer from './reducers/user-reducer';
import profileReducer from './reducers/profile-reducer';
import studentReducer from './reducers/student-reducer';
import associationReducer from './reducers/association-reducer';
import followReducer from './reducers/follow-reducer';
import eventsReducer from './reducers/events-reducer';
import userPreferencesReducer from './reducers/user-preferences-reducer';
import announcementsReducer from './reducers/announcements-reducer';

export let navigate: NavigateFunction = null;
export let currentLocation: Location = null;

export const registerNavigate = (navigateFn: NavigateFunction, location: Location) => {
  navigate = navigateFn;
  currentLocation = location;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    profile: profileReducer,
    student: studentReducer,
    association: associationReducer,
    follow: followReducer,
    events: eventsReducer,
    userPreferences: userPreferencesReducer,
    announcements: announcementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
