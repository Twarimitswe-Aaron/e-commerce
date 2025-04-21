import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, SignupPage, ActivationPage, HomePage } from "./Routes";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { server } from "./server";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  useEffect(() => {
    axios.get(`${server}/user/get-user`, { withCredentials: true })
      .then(res => {
        toast.success(res.data.message || "User fetched successfully");
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Failed to fetch user";
                           console.log(errorMessage)
        toast.error(errorMessage);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activation/:activation_token" element={<ActivationPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;