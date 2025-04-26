import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Home from "../components/Login/Login.jsx";

const HomePage= () => {
  return (
    <div>
        <Home />
    </div>
  )
}

export default HomePage;


