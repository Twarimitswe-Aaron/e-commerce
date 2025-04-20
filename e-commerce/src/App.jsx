import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, SignupPage, ActivationPage, HomePage } from "./Routes";
import "./App.css";
function App() {
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