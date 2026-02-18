import React from "react";
import Lottie from "lottie-react";
import Success from "../assets/animations/success.json";
import { Link } from "react-router-dom";

const UnsubscribeSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 text-center absolute top-0 left-0 w-full z-99">
      
      {/* animation */}
      <div className="w-60 mb-6">
        <Lottie animationData={Success} loop={false} />
      </div>

      {/* message */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
        You’re Unsubscribed
      </h1>

      <p className="text-gray-600 max-w-md mb-6">
        You have been successfully unsubscribed from our newsletter.
        You will no longer receive emails from us.
      </p>

      {/* optional link */}
      <Link
        to="/"
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition"
      >
        Go back to home
      </Link>

      {/* footer note */}
      <p className="text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} Maa Baglamukhi Mandir
      </p>
    </div>
  );
};

export default UnsubscribeSuccess;