import { React, useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading,
} from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    avatar: null,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const validate = (name, value) => {
    const errors = {};
    if (name === "email") {
      if (!value) {
        errors.email = "• Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = "• Please enter a valid email address.";
      } else {
        errors.email = ""; // Clear error if valid
      }
    }
    if (name === "name") {
      if (!value) {
        errors.name = "• Name is required.";
      } else if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
        errors.name = "• Name cannot contain special characters.";
      } else {
        errors.name = ""; // Clear error if valid
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    // Validate the field and update errors
    const errors = validate(name, fieldValue);
    setFormErrors((prev) => ({
      ...prev,
      [name]: errors[name] || "", // Clear error if none
    }));
  };

  const handleFocus = (e) => {
    const { name, value } = e.target;
    const errors = validate(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: errors[name] || "", // Clear error if none
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const emailErrors = validate("email", formData.email);
    const passwordErrors = validate("password", formData.password);
    const errors = { ...emailErrors, ...passwordErrors };
  
    if (Object.keys(errors).some((key) => errors[key])) {
      setFormErrors(errors);
      return;
    }
    
    if (!formData.avatar) {
      toast.error("Please upload a profile picture");
      return;
    }
  
    
  
    try {
      setIsLoading(true);
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("file", formData.avatar);
      
      const res = await axios.post(`${server}/user/create-user`, submitData, {
        withCredentials: true,
      });
  
      toast.success(res.data.message);
      
      setFormData({
        email: "",
        name: "",
        password: "",
        avatar: null,
      });
  
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Signup failed");
    }finally{
      setIsLoading(false);
    }
  }
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.name
                      ? "border-red-500"
                      : formData.name
                      ? "border-green-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm">{formErrors.name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  <p className="mt-2 text-red-400 text-sm">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  autoComplete="new-password"
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
             {formErrors.password && (
              <ul className="mt-2 text-red-500 text-sm list-disc pl-5">
                {formErrors.password.split("\n").map((error, index) => ( 
                  <li className="list-none" key={index}>
                    {error}
                  </li>
                 ))}
              </ul>
             )}
            </div>

            {/* Avatar Upload */}
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture (Compulsory)
              </label>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  {formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <RxAvatar className="h-full w-full text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>Choose file</span>
                  <input
                    id="avatar-upload"
                    name="avatar"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">JPG, PNG up to 2MB</p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-dotted border-white rounded-full animate-spin"></div>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
