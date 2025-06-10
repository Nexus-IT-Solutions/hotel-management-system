import React, { useState } from "react";
import { Mail, User, Lock, X, Loader2 } from "lucide-react";
import Image1 from '../assets/images/image3.jpg';
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hitting the endpoint using axios
    axios.post("https://hotel-management-system-hqbw.onrender.com/v1/auth/login", {
      "username": username,
      "password": password
    })
    .then((res) => {
      // Checking status code
      console.log(res)
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setIsLoading(false);
        window.location.href = "/dashboard";
      }
    })
    .catch((error) => {
      alert("OOPs!!!. An error occurred");
    });
    
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage({
        type: "success",
        text: "Password reset link has been sent to your email!",
      });

      // Close modal after success
      setTimeout(() => {
        setShowForgotModal(false);
        setResetEmail("");
        setMessage({ type: "", text: "" });
      }, 2000);
    } catch {
      setMessage({
        type: "error",
        text: "Sorry, we couldn't process your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setResetEmail("");
    setMessage({ type: "", text: "" });
    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side - Image section */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50"></div>
           <img src={Image1} alt="" className='object-cover w-full h-full'/>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 text-center px-4 sm:px-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-20">Hotel Name Here</h1>
            <div className="mb-6 w-16 md:w-24 lg:w-28 h-16 md:h-24 lg:h-28 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-8 md:w-12 lg:w-14 h-8 md:h-12 lg:h-14 bg-white rounded-full"></div>
            </div>
            <p className="text-base md:text-lg max-w-md leading-relaxed px-4">
              Lorem ipsum dolor sit amet consectetur. Habitasse tempus vitae
              vitae pellentesque.
            </p>
          </div>
          {/* Decorative circle */}
          <div className="absolute -bottom-40 -right-40 w-64 md:w-80 h-64 md:h-80 bg-blue-600 rounded-full opacity-90"></div>
        </div>

        {/* Mobile Logo (only shows on mobile) */}
        <div className="md:hidden flex justify-center items-center pt-8 pb-4 relative">
          <div className=" rounded-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full">
              <img src={Image1} alt="" className="w-full h-full rounded-full"/>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 flex flex-col  items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden min-h-[80vh] md:min-h-full">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-40 sm:w-56 md:w-40 lg:w-56 h-40 sm:h-56 md:h-40 lg:h-56 bg-blue-600 rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-40 sm:w-56 md:w-40 lg:w-56 h-40 sm:h-56 md:h-40 lg:h-56 bg-blue-600 rounded-full"></div>

          <div className="w-full max-w-md z-10 my-8 md:my-0">
            <div className="bg-gray-50 p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm">
              <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 md:mb-10 text-center">
                LOGIN
              </h1>

              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                <div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 flex items-center h-full">
                      <User className="h-[18px] w-[18px] text-gray-400" />
                    </span>
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-1  placeholder-gray-400 text-sm"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 flex items-center h-full">
                      <Lock className="h-[18px] w-[18px] text-gray-400" />
                    </span>
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-1  placeholder-gray-400 text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl hover:bg-blue-500 transition duration-200 mt-4 text-sm sm:text-base"
                onClick={() => setIsLoading(true)}
                >
                  {isLoading ? "Logging In..." : "Login"}
                </button>


                
              </form>
            </div>
          </div>

          <footer className="bg-white text-slate-500 py-1 fixed bottom-0">
            <div className="container mx-auto px-4 text-center text-[10px] md:text-sm">
              <p>&copy; {new Date().getFullYear()} Hotel Management System</p>
              <p>Developed by: Nolex Prime</p>
            </div>
          </footer>
        </div>

        
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 opacity-100 transition-all duration-300">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 relative transform translate-y-0 opacity-100 transition-all duration-300">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={closeForgotModal}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Body */}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

              <p className="text-gray-600 text-sm mb-8">
                Enter your email below. A link will be sent to your email to
                reset your password to a new one
              </p>

              {/* Success Message */}
              {message.type === "success" && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm opacity-100 transform translate-y-0 transition-all duration-300">
                  {message.text}
                </div>
              )}

              {/* Error Message */}
              {message.type === "error" && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm opacity-100 transform translate-y-0 transition-all duration-300">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#6B001F] focus:border-[#6B001F] text-sm placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#6B001F] text-white py-3.5 rounded-xl hover:bg-[#590019] transition-all duration-200 text-sm flex items-center justify-center disabled:opacity-50"
                >
                  <span>{isLoading ? "Sending..." : "Send link to Email"}</span>
                  {isLoading && (
                    <Loader2 className="animate-spin ml-2 h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
