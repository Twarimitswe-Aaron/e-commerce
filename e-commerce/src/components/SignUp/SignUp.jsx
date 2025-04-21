import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    avatar: null
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" }};
      const newForm = new FormData();
      
      if (formData.avatar) newForm.append("file", formData.avatar);
      newForm.append("name", formData.name);
      newForm.append("email", formData.email);
      newForm.append("password", formData.password);

      const res = await axios.post(`${server}/user/create-user`, newForm, config);
      
      toast.success(res.data?.message || "Signup successful!");
      if (res.data?.success) {
        navigate("/login");
        setFormData({
          email: "",
          name: "",
          password: "",
          avatar: null
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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

    setFormData(prev => ({ ...prev, avatar: file }));
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

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
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              <p className="mt-1 text-xs text-gray-500">
                Minimum 6 characters
              </p>
            </div>

            {/* Avatar Upload */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Profile Picture (Optional)
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
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG up to 2MB
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
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

export default SignupPage;