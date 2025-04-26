import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const validate = (name, value) => {
    const errors = {};
    if (name === "email") {
      if (!value) {
        errors.email = "• Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = "• Please enter a valid email address.";
      } else {
        errors.email = "";
      }
    }
    if (name === "password") {
      if (!value) {
        errors.password = "• Password is required.";
      } else {
        let passwordErrors = "";
        if (value.length < 6) {
          passwordErrors += "• Password must be at least 6 characters.\n";
        }
        if (!/[A-Z]/.test(value)) {
          passwordErrors += "• Password must include at least one uppercase letter.\n";
        }
        if (!/[0-9]/.test(value)) {
          passwordErrors += "• Password must include at least one number.\n";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          passwordErrors += "• Password must include at least one special character.\n";
        }
        errors.password = passwordErrors.trim() || "";
      }
    }
    return errors;
  };

  const handleFocus = (e) => {
    const { name, value } = e.target;
    const errors = validate(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: errors[name] || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    const errors = validate(name, fieldValue);
    setFormErrors(prev => ({
      ...prev,
      [name]: errors[name] || "",
    }));
    setShowPasswordErrors(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPasswordErrors(true);

    const emailErrors = validate("email", formData.email);
    const passwordErrors = validate("password", formData.password);
    const errors = { ...emailErrors, ...passwordErrors };

    if (Object.values(errors).some(error => error)) {
      setFormErrors(errors);
      return; 
    }

    

 

    try {
      setIsLoading(true);
      await axios
      .post(
        `${server}/user/login-user`,
        {
          email:formData.email,
          password:formData.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login Success!");
        navigate("/");
        window.location.reload(true); 
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });

      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid credentials";
        } else {
          errorMessage = err.response.data?.message
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={5000} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="none"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.email
                      ? "border-red-500"
                      : formData.email
                      ? "border-green-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.password
                      ? "border-red-500"
                      : formData.password
                      ? "border-green-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setIsVisible(!isVisible)}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                >
                  {isVisible ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {showPasswordErrors && formErrors.password && (
                <ul className="mt-2 text-red-500 text-sm list-disc pl-5">
                  {formErrors.password.split("\n").map((error, index) => (
                    <li key={index} className="list-none">
                      {error}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-dotted border-white rounded-full animate-spin"></div>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;