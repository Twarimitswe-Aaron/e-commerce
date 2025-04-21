import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage, SignupPage, ActivationPage, HomePage, Loader } from "./Routes";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "./server";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${server}/user/get-user`, { 
          withCredentials: true 
        });
        
        if (data.success) {
          setIsAuthenticated(true);
          toast.success(data.message || "Welcome back!");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                             "Session expired. Please log in again";
        console.error("Authentication error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    // Check if a token exists before making the request
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      checkAuth();
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/activation/:activation_token" 
            element={<ActivationPage />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;