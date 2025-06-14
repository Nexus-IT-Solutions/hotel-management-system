import React, { useState } from "react";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    // Handle OTP verification logic here
    alert("OTP Verified!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-sm flex flex-col items-center"
        style={{ boxShadow: "0 4px 24px #0002" }}
      >
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Enter OTP</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Please enter the 6-digit code sent to your email or phone.
        </p>
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          maxLength={6}
          className="text-center text-lg tracking-widest border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="------"
          autoFocus
        />
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition mb-2"
        >
          Verify OTP
        </button>
        <button
          type="button"
          className="text-blue-500 hover:underline text-sm"
          onClick={() => alert("Resend OTP logic here")}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default OTP;