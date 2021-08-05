/* eslint-disable no-unused-vars */
import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  UPDATE_START,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  LOGOUT,
} from '../constants/actionTypes';

export const LoginStart = (userCredientials) => ({
  type: LOGIN_START,
});

export const LoginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const LoginFailure = () => ({
  type: LOGIN_FAILURE,
});

export const Logout = () => ({
  type: LOGOUT,
});

export const UpdateStart = (userCredientials) => ({
  type: UPDATE_START,
});

export const UpdateSuccess = (user) => ({
  type: UPDATE_SUCCESS,
  payload: user,
});

export const UpdateFailure = () => ({
  type: UPDATE_FAILURE,
});
