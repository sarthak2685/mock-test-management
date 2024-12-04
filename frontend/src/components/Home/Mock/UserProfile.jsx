import { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState({ name: "Unknown User", role: "Student" }); // Default state

  useEffect(() => {
    // Fetch user details from local storage
    const storedData = localStorage.getItem("user"); // Assuming JSON object is stored under 'user' key
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData); // Parse JSON string
        if (
          parsedData &&
          typeof parsedData.name === "string" &&
          typeof parsedData.type === "string"
        ) {
          setUser({ name: parsedData.name, role: parsedData.type }); // Assign 'type' as 'role'
        } else {
          console.warn("Invalid user data format.");
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []); // Dependency array empty ensures it runs once

  return (
    <div className="flex items-center space-x-3 px-2 bg-gray-50 rounded-lg shadow-sm">
      {/* Render initials based on the user's name */}
      <div className="w-12 h-12 p-2 rounded-full bg-blue-500 text-white flex items-center justify-center">
        <span className="text-lg font-semibold">
          {user.name.charAt(0).toUpperCase() || "U"}
        </span>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
