import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/SideBars";
import DashboardHeader from "./DashboardHeader";
import Select from "react-select";
import { FaTrashAlt } from "react-icons/fa";
import config from "../../config";

const NoticeAdmin = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [alerts, setAlerts] = useState([]); // Track sent messages
  const [students, setStudents] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  const idAuth = S.id_auth;

  // Toggle sidebar on click
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
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

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/admin-student-crud/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      if (Array.isArray(result.data)) {
        const formattedStudents = result.data.map((student) => ({
          value: student.id,
          label: student.name,
        }));
        setStudents(formattedStudents);
      } else {
        console.error("Expected an array but received:", result.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle student selection change
  const handleStudentChange = (selected) => {
    if (selected.some((option) => option.value === "selectAll")) {
      setSelectedOptions(students);
    } else if (selected.some((option) => option.value === "deselectAll")) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(selected);
    }
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (message.trim()) {
      if (selectedOptions.length === 0) {
        setModalContent("Please select at least one recipient.");
        setIsModalVisible(true);
        return;
      }

      const newAlerts = [];
      for (let option of selectedOptions) {
        const messageData = {
          message: message.trim(),
          sender: idAuth, // User ID as sender
          recipient: option.value, // Single Student ID as recipient
          is_admin: option.value === 1 ? "OK" : "NOT OK", // Set is_admin to "OK" if recipient is 1, otherwise "NOT OK"
        };

        try {
          const response = await fetch(`${config.apiUrl}/notifications/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messageData),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          newAlerts.push({ ...messageData, recipient: option.label });
        } catch (error) {
          setModalContent("Failed to send the message. Please try again.");
          console.error("Error sending message:", error);
        }
      }

      // Update the alerts state with new messages
      setAlerts((prevAlerts) => {
        const updatedAlerts = [...prevAlerts, ...newAlerts];
        // Store sent messages in localStorage
        localStorage.setItem("sentMessages", JSON.stringify(updatedAlerts));
        return updatedAlerts;
      });

      // Reset message input and selected options
      setMessage("");
      setSelectedOptions([]);
      setModalContent("Message sent successfully!");
      setIsModalVisible(true);
    } else {
      setModalContent("Please enter a valid message.");
      setIsModalVisible(true);
    }
  };

  // Handle message deletion
  const handleDeleteMessage = (index) => {
    const updatedAlerts = alerts.filter((_, i) => i !== index);
    setAlerts(updatedAlerts);
    // Update localStorage after deleting a message
    localStorage.setItem("sentMessages", JSON.stringify(updatedAlerts));
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Layout Structure */}
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          {/* Header */}
          <DashboardHeader
            user={{ user: "Admin" }}
            toggleSidebar={toggleSidebar}
          />

          {/* Main Content */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

            {/* Dropdown Section */}
            <div className="flex flex-col mb-6">
              <label
                htmlFor="student"
                className="text-lg sm:text-xl md:text-xl font-semibold text-gray-700 mb-2"
              >
                Select Student(s)
              </label>
              <Select
                isMulti
                options={[
                  { value: "selectAll", label: "Select All" },
                  { value: "deselectAll", label: "Deselect All" },
                  ...students,
                ]}
                onChange={handleStudentChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Student(s)"
                value={selectedOptions}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "lightgray",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "blue",
                    },
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                  }),
                  option: (base, { data }) => ({
                    ...base,
                    display:
                      data.value === "selectAll" || data.value === "deselectAll"
                        ? "inline-block"
                        : "block",
                    width:
                      data.value === "selectAll" || data.value === "deselectAll"
                        ? "48%"
                        : "100%",
                    textAlign: "center",
                    padding: "0.75rem",
                  }),
                  menu: (base) => ({
                    ...base,
                    display: "flex",
                    flexDirection: "column",
                    padding: "0.5rem",
                  }),
                }}
              />
            </div>

            {/* Message Input Section */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="text-lg font-semibold text-gray-700 mb-2 block"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button
                className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSendMessage}
              >
                Send Message
              </button>
            </div>

            {/* Display Sent Messages */}
            {/* <div>
              <h2 className="text-xl font-semibold mb-4">Sent Messages</h2>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-700">Message:</p>
                        <p className="text-gray-800">{alert.message}</p>
                        <p className="font-medium text-gray-700 mt-2">
                          Sent to:
                        </p>
                        <p className="text-gray-800">{alert.recipient}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No messages sent yet.</p>
              )}
            </div> */}
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-lg font-medium mb-4">Notification</h2>
            <p className="text-gray-700 mb-4">{modalContent}</p>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeAdmin;
