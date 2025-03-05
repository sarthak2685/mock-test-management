import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = user.type || "student";

  const handleRedirect = () => {
    if (userRole === "owner") {
      navigate("/super-admin");
    } else if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const timer = setTimeout(handleRedirect, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-subtitle">Page Not Found</p>
        <p className="notfound-message">
          Oops! The page you are looking for doesn’t exist.<br />
          It might have been moved or deleted.<br />
          You are not authorized to access this page.<br />
          You will be redirected shortly.
        </p>
        <button className="notfound-button" onClick={handleRedirect}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;

/* CSS */
const styles = `
  .notfound-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #ffffff;
    padding: 20px;
  }

  .notfound-content {
    text-align: center;
    padding: 40px;
  }

  .notfound-title {
    font-size: 96px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 10px;
  }

  .notfound-subtitle {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
  }

  .notfound-message {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .notfound-button {
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .notfound-button:hover {
    background-color: #0056b3;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
