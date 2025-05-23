
import {server} from "../../server.js";
import axios from "axios";

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type:"LoadUserRequest"
    })
    const { data } = await axios.get(`${server}/user/get-user`, {
      withCredentials: true,
    });

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user
    });

  } catch (error) {
    dispatch({
      type:"LoadUserFail",
      payload:error?.response?.data?.message
    })
  }
};

