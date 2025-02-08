import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../SuperAdminDashboard/Sidebar";
import DashboardHeader from "../SuperAdminDashboard/Header";
import Select from "react-select";
import config from "../../config";

const NoticeOwner = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const [message, setMessage] = useState("");
  const [institutes, setInstitutes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const { token, id: senderId } = JSON.parse(localStorage.getItem("user")) || {};

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // Fetch institutes
  const fetchInstitutes = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiUrl}/vendor-admin-crud/`, {
        headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(response.statusText);

      const result = await response.json();
      if (Array.isArray(result.data)) {
        setInstitutes(
          result.data.map(({ id, institute_name }) => ({ value: id, label: institute_name }))
        );
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  // Handle dropdown selection
  const handleInstituteChange = (selected) => {
    if (selected.some(({ value }) => value === "selectAll")) {
      setSelectedOptions(institutes);
    } else if (selected.some(({ value }) => value === "deselectAll")) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(selected);
    }
  };

  // Send message to selected institutes
  const handleSendMessage = async () => {
    if (!message.trim()) return showModal("Please enter a valid message.");
    if (selectedOptions.length === 0) return showModal("Please select at least one recipient.");

    try {
      await Promise.all(
        selectedOptions.map(({ value }) =>
          fetch(`${config.apiUrl}/notifications/`, {
            method: "POST",
            headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ message, sender: senderId, recipient: value, is_admin: "NOT OK" }),
          })
        )
      );

      setMessage("");
      setSelectedOptions([]);
      showModal("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      showModal("Failed to send the message. Please try again.");
    }
  };

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} className="hidden md:block" />
        <div className={`flex-grow transition-all duration-300 ${isCollapsed ? "ml-0" : "ml-64"}`}>
          <DashboardHeader user={{ user: "Owner" }} toggleSidebar={toggleSidebar} />
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

            <div className="mb-6">
              <label className="text-lg font-semibold text-gray-700 mb-2 block">Select Institute(s)</label>
              <Select
                isMulti
                options={[{ value: "selectAll", label: "Select All" }, { value: "deselectAll", label: "Deselect All" }, ...institutes]}
                onChange={handleInstituteChange}
                value={selectedOptions}
                placeholder="Select Institute(s)"
                styles={{
                  control: (base) => ({ ...base, borderColor: "lightgray", padding: "0.5rem", borderRadius: "0.5rem" }),
                  menu: (base) => ({ ...base, padding: "0.5rem" }),
                }}
              />
            </div>

            <div className="mb-6">
              <label className="text-lg font-semibold text-gray-700 mb-2 block">Message</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-md hover:bg-blue-600" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <p className="text-lg font-semibold text-gray-700">{modalContent}</p>
            <button className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-md hover:bg-blue-600" onClick={() => setIsModalVisible(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeOwner;
