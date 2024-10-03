import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patientSlice';

const store = configureStore({
  reducer: {
    form: patientReducer,
  },
});

export default store;