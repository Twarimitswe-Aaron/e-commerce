import {React,useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import styles from "../../styles/styles"
import { Link } from "react-router-dom";

function LoginPage() {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [isVisible,setVisible]=useState('false');
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 ls:px-8">

        {/* title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
      </div>

      

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4  shadow sm:rounded-lg sm:px-10 ">
          <form action="" className="space-y-6">

            {/* email input */}
            <div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
            </div>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               
              />
            </div>
            </div>

            {/* password input */}

            <div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
            </div>
            <div className="mt-1 relative">
              <input
                type={!isVisible?"text":"password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               
              />
              {
                isVisible?
                <AiOutlineEye 
              className="absolute right-2 top-2 cursor-pointer"
              size={25}
              onClick={()=>setVisible(false)}
              />:
              <AiOutlineEyeInvisible
              className="absolute right-2 top-2 cursor-pointer"
              size={25}
              onClick={()=>setVisible(true)}
              />
              }

            </div>
            </div>

           
            <div className={`${styles.normalFlex} justify-between`}>
                 {/* Remember me */}
                <div className={`${styles.normalFlex}`}>
                    <input type="checkbox" name="remember-me" id="rememeber-me"
                    className="h-3 w-4 text-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                    >
                        Remember me
                    </label>
                </div>
                <div className="text-sm">
                    <a href=".forgot-password"
                    className='font-medium text-blue-600 hover:text-blue-500'
                    >
                        Forgot your password
                    </a>
                </div>

 
            </div>

            {/* Submit button */}

            <div>
                <button type="submit" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-med rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">Login</button>
            </div>

            <div className={`${styles.normalFlex} w-full`}>
                <h4>Don't have an account</h4>
                <Link to="/SignUp" className="text-blue-600 pl-2">Sign Up</Link>
            </div>



           
          </form>
        </div>
      </div>
    </div>
  );
}

export  default LoginPage;
