import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebarr";
import DashboardHeader from "./DashboardHeaders";

const Profile = ({ user }) => {
  // Ensure user object has valid properties or provide defaults
  const defaultUser = {
    name: "Guest",
    avatar: "",
    age: "",
    sex: "",
    mobile: "",
  };

  const safeUser = user || defaultUser; // Fallback to default if user is undefined

  const [formData, setFormData] = useState({
    name: safeUser.name || "",
    avatar: safeUser.avatar || "",
    age: safeUser.age || "",
    sex: safeUser.sex || "",
    mobile: safeUser.mobile || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow ml-64 p-4">
          <DashboardHeader user={safeUser} />

          <div className="max-w-screen-lg mx-auto bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600">Avatar</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="Enter avatar URL"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
