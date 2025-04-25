import axios from "axios";

// Action Types (It's good practice to define these explicitly)
export const LoadUserRequest = "LoadUserRequest";
export const LoadUserSuccess = "LoadUserSuccess";
export const LoadUserFail = "LoadUserFail";
export const ClearError = "ClearError";
export const LogoutSuccess = "LogoutSuccess";
export const LogoutFail = "LogoutFail";

export const loadUser = () => async (dispatch) => {
    try {
      dispatch({ type: 'LoadUserRequest' });
      
      // Check for token first
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const { data } = await axios.get(`${server}/user/get-user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token.split('=')[1]}` // Extract token value
        }
      });
  
      dispatch({
        type: 'LoadUserSuccess',
        payload: data.user
      });
      
      toast.success(data.message || "Welcome back!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Session expired. Please log in again";
      
      dispatch({
        type: 'LoadUserFail',
        payload: errorMessage
      });
      
      toast.error(errorMessage);
      
      // Clear invalid token
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };

export default loadUser;