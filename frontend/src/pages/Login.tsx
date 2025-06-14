import React, { useState, useEffect, useRef } from "react";
import { Mail, User, Lock, X, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image1 from "../assets/images/image3.jpg";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password modal states
  const [forgotPasswordState, setForgotPasswordState] = useState({
    email: "",
    isLoading: false,
    isSubmitted: false,
    error: "",
  });

  // OTP modal state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);

  // Reset password modal state
  const [resetState, setResetState] = useState({
    password: "",
    confirmPassword: "",
    isLoading: false,
    error: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  // Track modal stack for back navigation
  const [modalStack, setModalStack] = useState<string[]>([]);

  // Add this state for countdown
  const [resendCountdown, setResendCountdown] = useState(60);

  // Add these states in your component:
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post("http://api.hotel.com/v1/auth/login", {
        usernameOrEmail: username,
        password: password,
      })
      .then((res) => {
        if (res.data.code === 200 && res.data.status === 'success') {
          localStorage.setItem(
            "userData",
            JSON.stringify({
              user: res.data.user,
              token: res.data.token,
            })
          ); 
          setIsLoading(false);
          if (res.data.user.role === "manager") {
            Swal.fire({
              title: "Login Successful",
              text: "Welcome back, Admin!",
              icon: "success",
            });
            window.location.href = "/admin";
          } else if (res.data.user.role === "receptionist") {
            Swal.fire({
              title: "Login Successful",
              text: "Welcome back, Receptionist!",
              icon: "success",
            });
            window.location.href = "/receptionist";
          } else if (res.data.user.role === "ceo") {
            Swal.fire({
              title: "Login Successful",
              text: "Welcome back, CEO!",
              icon: "success",
            });
            window.location.href = "/ceo";
          }
        } else if (res.data.code === 404 && res.data.status === 'error') {
          Swal.fire({
            title: "Not Found",
            text: res.data.message || "User not found, please check your email or username",
            icon: "error"
          });
          setIsLoading(false);
        } else if (res.data.code === 401 && res.data.status === 'error') {
          Swal.fire({
            title: "Unauthorized",
            text: res.data.message || "Incorrect password, please try again",
            icon: "error",
          });
          setIsLoading(false);
        } else if (res.data.code === 403 && res.data.status === 'error') {
          Swal.fire({
            title: "Deactivated",
            text: res.data.message || "Account deactivated",
            icon: "error",
          });
          setIsLoading(false);
        } else {
          Swal.fire({
            title: "Error",
            text: "Something went wrong, please try again later or contact system admin",
            icon: "error",
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {  
        console.log(error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while logging in. Please check your network connection and other settings and try again.",
            icon: "error",
          });
          setIsLoading(false);
      });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordState.email.trim()) {
      setForgotPasswordState((prev) => ({
        ...prev,
        error: "Email is required",
      }));
      return;
    }

    if (!validateEmail(forgotPasswordState.email)) {
      setForgotPasswordState((prev) => ({
        ...prev,
        error: "Please enter a valid email address",
      }));
      return;
    }

    setForgotPasswordState((prev) => ({
      ...prev,
      isLoading: true,
      error: "",
    }));

    try {
      // TODO: Call API to send OTP to email
      const response = await axios.post("https://hotel-management-system-5gk8.onrender.com/v1/auth/forgot-password", JSON.stringify(
        { email: forgotPasswordState.email }
      ));

      if (response.status !== 200) {
        throw new Error("Failed to send OTP");
      }

        const now = Math.floor(Date.now() / 1000);
        console.log(response.data.expires_in);
        const otpExpiry = now + Number(response.data.expires_in);
        // Storing response data in localstorage
        localStorage.setItem("forgotPasswordData", JSON.stringify({
          user: response.data.user,
          token: response.data.token,
          expires_in: otpExpiry,
        }));
        Swal.fire({
          title: "OTP Sent",
          text: "An OTP has been sent to your email. Please check your inbox.",
          icon: "success",
        });

        setForgotPasswordState((prev) => ({
        ...prev,
        isLoading: false,
        isSubmitted: true,
      }));
      // Open OTP modal and push to stack
      setShowForgotModal(false);
      setShowOtpModal(true);
      setModalStack((prev) => [...prev, "forgot"]);

      
      
    } catch {
      Swal.fire({
        title: "Error",
        text: "An error occurred while sending the OTP. Please check your network connection and try again.",
        icon: "error",
      });
      setForgotPasswordState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error. Please try again.",
      }));
    }
  };

  // OTP Modal Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
    // Move to previous input if deleted
    if (!value && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
    setOtpError("");
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpInputs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    // Expiry check code here...

    setIsVerifyingOtp(true);
    try {
      // API call to verify OTP
      const response = await axios.post("https://hotel-management-system-5gk8.onrender.com/v1/auth/validate-otp", {
        otp: otp.join(""),
      });
    if (response.status !== 200 ) {
      setOtpError(response.data.message || "Invalid OTP. Please try again.");
      return;
    }
    Swal.fire({
      title: "OTP Verified",
      text: "Your OTP has been successfully verified.",
      icon: "success",
    });
    setShowOtpModal(false);
    setShowResetModal(true);
    setModalStack((prev) => [...prev, "otp"]);
    }
    catch {
      Swal.fire({
        title: "Error",
        text: "An error occurred while verifying the OTP. Please check your OTP digits or network connection and try again.",
        icon: "error",
      });
      setOtpError("Error. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Reset Password Modal Handlers
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetState.password || !resetState.confirmPassword) {
      setResetState((prev) => ({
        ...prev,
        error: "Please fill in all fields.",
      }));
      return;
    }
    if (resetState.password.length < 6) {
      setResetState((prev) => ({
        ...prev,
        error: "Password must be at least 6 characters.",
      }));
      return;
    }
    if (resetState.password !== resetState.confirmPassword) {
      setResetState((prev) => ({
        ...prev,
        error: "Passwords do not match.",
      }));
      return;
    }
    setResetState((prev) => ({
      ...prev,
      isLoading: true,
      error: "",
    }));


    // TODO: Call API to reset password
    try{
      const response = await axios.post("https://hotel-management-system-5gk8.onrender.com/v1/auth/reset-password", JSON.stringify(
      {
      otp: otp.join(""),
      newPassword: resetState.password,
    }
    ));

    if (response.status !== 200 ) {
      setResetState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.data.message || "Failed to reset password. Please try again.",
      }));
      return;
    }
    setResetState({
      password: "",
      confirmPassword: "",
      isLoading: false,
      error: "",
      showPassword: false,
      showConfirmPassword: false,
    });
    setShowResetModal(false);
    setModalStack([]);
    Swal.fire({
      title: "Password Reset Successful",
      text: "You can now log in with your new password.",
      icon: "success",
    });
    }
    catch {
      Swal.fire({
        title: "Error",
        text: "An error occurred while resetting your password. Please check your network connection and try again.",
        icon: "error",
      });
      setResetState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error. Please try again.",
      }));
    }
  };

  // Modal Navigation
  const handleBack = () => {
    if (modalStack.length === 0) return;
    const prev = modalStack[modalStack.length - 1];
    setModalStack((stack) => stack.slice(0, -1));
    if (showResetModal) {
      setShowResetModal(false);
      if (prev === "otp") setShowOtpModal(true);
    } else if (showOtpModal) {
      setShowOtpModal(false);
      if (prev === "forgot") setShowForgotModal(true);
    }
  };

  const closeAllModals = () => {
    setShowForgotModal(false);
    setShowOtpModal(false);
    setShowResetModal(false);
    setModalStack([]);
    setForgotPasswordState({
      email: "",
      isLoading: false,
      isSubmitted: false,
      error: "",
    });
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setResetState({
      password: "",
      confirmPassword: "",
      isLoading: false,
      error: "",
      showPassword: false,
      showConfirmPassword: false,
    });
  };

  // Start countdown when OTP modal opens
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpModal && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (!showOtpModal) {
      setResendCountdown(60); // Reset when modal closes
    }
    return () => clearInterval(timer);
  }, [showOtpModal, resendCountdown]);

  // Resend OTP handler
  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      // TODO: Call API to resend OTP here
      // await axios.post("/api/resend-otp", { email: forgotPasswordState.email });
      await axios.post("https://hotel-management-system-5gk8.onrender.com/v1/auth/forgot-password", {
        email: forgotPasswordState.email,
      });
      setOtp(["", "", "", "", "", ""]); // Clear previous OTP
      Swal.fire("OTP resent!", "Check your email for a new code.", "info");
      setResendCountdown(60); // Restart countdown
    } catch {
      Swal.fire("Error", "Failed to resend OTP.", "error");
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side - Image section */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50"></div>
          <img src={Image1} alt="" className="object-cover w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 text-center px-4 sm:px-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-20">
              Hotel Name Here
            </h1>
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
              <img src={Image1} alt="" className="w-full h-full rounded-full" />
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
                      required
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
                      required
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
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl hover:bg-blue-500 transition duration-200 mt-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
              onClick={closeAllModals}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-1 placeholder-gray-400 text-sm"
                      placeholder="Enter your email"
                      value={forgotPasswordState.email}
                      onChange={e =>
                        setForgotPasswordState(prev => ({
                          ...prev,
                          email: e.target.value,
                          error: "",
                        }))
                      }
                      required
                      disabled={forgotPasswordState.isLoading}
                    />
                  </div>
                  {forgotPasswordState.error && (
                    <div className="flex items-center text-red-600 text-xs mt-2">
                      <span className="mr-1">!</span>
                      {forgotPasswordState.error}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={forgotPasswordState.isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 transition duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotPasswordState.isLoading ? "Sending..." : "Send Reset OTP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 relative shadow-2xl">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
              onClick={closeAllModals}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <button
                  className="mr-3 text-blue-600 hover:text-blue-800 transition"
                  onClick={handleBack}
                  aria-label="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 flex-1 text-center">
                  Enter OTP
                </h2>
              </div>
              <p className="text-gray-500 mb-6 text-center text-sm">
                Enter the 6-digit code sent to your email.
              </p>
              <form onSubmit={handleOtpSubmit} className="flex flex-col items-center">
                <div className="flex gap-2 mb-4">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { otpInputs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition font-mono"
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onPaste={handleOtpPaste}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                {otpError && (
                  <div className="text-red-500 text-sm mb-2">{otpError}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition mb-2 disabled:opacity-50"
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
              <button
                type="button"
                className={`text-blue-500 hover:underline text-sm mt-2 disabled:opacity-50`}
                onClick={handleResendOtp}
                disabled={resendCountdown > 0 || isResendingOtp}
              >
                {isResendingOtp
                  ? "Resending..."
                  : resendCountdown > 0
                  ? `Resend OTP in 0:${resendCountdown.toString().padStart(2, "0")}`
                  : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 relative shadow-2xl">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
              onClick={closeAllModals}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <button
                  className="mr-3 text-blue-600 hover:text-blue-800 transition"
                  onClick={handleBack}
                  aria-label="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 flex-1 text-center">
                  Reset Password
                </h2>
              </div>
              <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={resetState.showPassword ? "text" : "password"}
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-1 placeholder-gray-400 text-sm"
                      placeholder="Enter new password"
                      value={resetState.password}
                      onChange={e =>
                        setResetState(prev => ({
                          ...prev,
                          password: e.target.value,
                          error: "",
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() =>
                        setResetState(prev => ({
                          ...prev,
                          showPassword: !prev.showPassword,
                        }))
                      }
                      tabIndex={-1}
                    >
                      {resetState.showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={resetState.showConfirmPassword ? "text" : "password"}
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-1 placeholder-gray-400 text-sm"
                      placeholder="Confirm new password"
                      value={resetState.confirmPassword}
                      onChange={e =>
                        setResetState(prev => ({
                          ...prev,
                          confirmPassword: e.target.value,
                          error: "",
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() =>
                        setResetState(prev => ({
                          ...prev,
                          showConfirmPassword: !prev.showConfirmPassword,
                        }))
                      }
                      tabIndex={-1}
                    >
                      {resetState.showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
                {resetState.error && (
                  <div className="text-red-500 text-sm">{resetState.error}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                  disabled={resetState.isLoading}
                >
                  {resetState.isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
