import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./reducers/user.js";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;