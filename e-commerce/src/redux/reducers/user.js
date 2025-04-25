import { createReducer } from "@reduxjs/toolkit";
import {
    LoadUserRequest,
    LoadUserSuccess,
    LoadUserFail,
    ClearError,
    LogoutSuccess,
    LogoutFail,
} from '../actions/user'; // Corrected import path

const initialState = {
    loading: false,
    isAuthenticated: false,
    user: null,
    error: null 
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case LoadUserRequest:
        return {
          ...state,
          loading: true,
        };
      case LoadUserSuccess:
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: action.payload,
        };
      case LoadUserFail:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          user: null,
          error: action.payload,
        };
      case ClearError:
        return {
          ...state,
          error: null,
        };
      case LogoutSuccess:
        return {
          ...initialState,
        };
      case LogoutFail:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };

export default userReducer;