import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  // Simulating role-based navigation (Replace this with actual authentication logic)
  const user = JSON.parse(localStorage.getItem("user")) || {}; 
  const userRole = user.type || "student";

  const handleRedirect = () => {
    if (userRole === "owner") {
        navigate("/super-admin");
    } else if (userRole  === "admin") {
        navigate("/admin");
    } else {
      navigate("/"); // Default to Home for students
    }
  };
  useEffect(() => {
    const timer = setTimeout(handleRedirect, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-7xl font-bold glitch" data-text="404">
        404
      </h1>
      <p className="text-xl mt-2 glitch" data-text="Page Not Found">
        Page Not Found
      </p>
      <p className="text-lg text-gray-400 mt-2">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <button
        onClick={handleRedirect}
        className="mt-5 px-6 py-3 bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-lg text-lg font-semibold"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
