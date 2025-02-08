import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar/SideBars";
import DashboardHeaders from "../StudentDashboard/DashboardHeaders";
import config from "../../config";

const Announcement = () => {
  const [announcementDate, setAnnouncementDate] = useState("");
  const [announcementTime, setAnnouncementTime] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const [ampm, setAmpm] = useState("AM"); // AM/PM toggle
  const user = JSON.parse(localStorage.getItem("user"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const token = user.token;
  const id = user.id;

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle sidebar collapse state
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTimeChange = (e) => {
    const time24Hr = e.target.value; // Time in 24-hour format (e.g., 14:30)
    const [hours, minutes] = time24Hr
      .split(":")
      .map((item) => parseInt(item, 10));
    const isAm = hours < 12;
    const hours12 = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hours12}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${isAm ? "AM" : "PM"}`;

    setAnnouncementTime(formattedTime); // Save the formatted time (12-hour format)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    const payload = {
      date: announcementDate,
      time: announcementTime,
      institute: id,
    };

    try {
      const response = await fetch(
        `${config.apiUrl}/exam-dates/?institute=${user.institute_name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Error setting announcement");
      }

      // Handle success
      const data = await response.json();
      setSuccessMessage("Test announcement set successfully!");
      setAnnouncementDate("");
      setAnnouncementTime("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-grow transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-0" : "ml-64"
        }`}
      >
        <DashboardHeaders toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-6 max-w-lg">
          <h2 className="text-2xl font-extrabold text-black mb-4 uppercase text-center">
            Set Next Test Announcement
          </h2>
          {successMessage && (
            <div className="mb-4 p-4 bg-green-200 text-green-800 border border-green-400 rounded">
              {successMessage}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md"
          >
            <div className="mb-4">
              <label
                htmlFor="announcementDate"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="announcementDate"
                value={announcementDate}
                onChange={(e) => setAnnouncementDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="announcementTime"
                className="block text-sm font-medium text-gray-700"
              >
                Time
              </label>
              <input
                type="time"
                id="announcementTime"
                onChange={handleTimeChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Announcement"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Announcement;
