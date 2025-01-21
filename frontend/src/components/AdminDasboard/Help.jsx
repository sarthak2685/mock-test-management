import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar/SideBars";
import DashboardHeader from "./DashboardHeader";

const Help = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    institute: "",
    comments: "",
  });
  const user = {
    name: "John Doe",
  };
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Collapse sidebar on mobile view
      } else {
        setIsCollapsed(false); // Expand sidebar on desktop view
      }
    };

    // Set initial state based on the current window size
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add form submission logic
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className={`${isCollapsed ? "hidden" : "block"} md:block`}
        />
        <main className="flex-grow p-6 bg-gray-100 ">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Admin Support Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                name="institute"
                placeholder="Institute Name"
                value={formData.institute}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
              <textarea
                name="comments"
                placeholder="Describe your issue"
                value={formData.comments}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
                rows="4"
              />
              <button
                type="submit"
                className="w-full bg-[#007bff] text-white py-3 rounded-md font-semibold hover:bg-blue-600"
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
