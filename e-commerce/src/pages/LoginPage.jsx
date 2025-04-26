import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from "../components/Login/Login.jsx"; // Assuming this is your actual login form component


const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      console.log("LoginPage useEffect: User is authenticated, navigating to /");
      navigate("/");
    } else {
      console.log("LoginPage useEffect: User is not authenticated");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <Login />
    </div>
  )
}

export default LoginPage;