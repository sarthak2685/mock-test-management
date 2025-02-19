import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/SideBars";
import DashboardHeader from "./DashboardHeader";
import config from "../../config";

const Help = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapsed state

  const [formData, setFormData] = useState({
    comments: "", // Form data for comments
  });

  const S = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage
  const user = {
    name: S?.name || "John Doe", // Get user name (fallback to 'John Doe')
    instituteName: S?.institute_name || "Your Institute", // Get institute name (fallback to default)
  };

  // Debugging: Log the user object to see if institute_name is properly assigned
  console.log("User data:", user);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar visibility
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Update form data
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = S?.token; // Get token from localStorage
    const userId = S?.id; // Get user ID from localStorage

    const recipient = 1; // Assume recipient ID is set here

    // Prepare the payload
    const payload = {
      message: formData.comments.trim(),
      sender: userId, // Use user ID instead of auth ID
      recipient, // Set the recipient dynamically
      is_admin: recipient === 1 ? "OK" : "NOT OK", // Set is_admin to "OK" if recipient === 1, otherwise "NOT OK"
      instituteName: user.instituteName, // Use the instituteName from the 'user' object
    };

    // Debugging: Log the payload before sending it to the server
    console.log("Payload to be sent:", payload);

    try {
      const response = await fetch(`${config.apiUrl}/notifications/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Message sent successfully:", result);
      setFormData({ comments: "" }); // Clear the form after submission
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle window resize to collapse the sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Ensure correct state on initial load
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-auto bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Dashboard Header */}
      <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

      <div className="flex">
        {/* Sidebar with Smooth Collapse */}
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "w-0 overflow-hidden" : "w-64"
          }`}
        >
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <main className="flex-grow p-6">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Admin Support
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Send Message or Command
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  placeholder="Type your message or command here..."
                  value={formData.comments}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                  rows="6"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
