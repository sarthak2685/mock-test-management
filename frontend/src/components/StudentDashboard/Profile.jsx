import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebarr";
import DashboardHeader from "./DashboardHeaders";
import config from "../../config";
import AvatarSelector from "../Avatar"; // Import your AvatarSelector
import { toast,ToastContainer } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css";


const Profile = () => {
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  console.log("Profile",S)

  const [formData, setFormData] = useState({
    name: S.name || "",
    avatar: "",
    age: S.age || "",
    sex: S.gender || "",
    mobile: S.mobile || "",
    customAvatar: "",
  });

  const handleAvatarSelect = (avatarConfig) => {
    setFormData({
      ...formData,
      avatar: avatarConfig ? JSON.stringify(avatarConfig) : "",
      customAvatar: null,
    });
  };
  const convertImageToBase64 = async (avatarUrl) => {
    const response = await fetch(avatarUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  // Handle custom avatar file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        alert("File size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, customAvatar: reader.result, avatar: "" });
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to convert to Base64 for file upload
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    if (formData.name) formDataToSend.append("name", formData.name);
    if (formData.mobile) formDataToSend.append("mobile_no", formData.mobile);
    if (formData.sex) formDataToSend.append("gender", formData.sex);

    try {
      let avatarBase64 = null;

      // Check if the user uploaded a custom avatar image
      if (formData.customAvatar) {
        avatarBase64 = formData.customAvatar;
      } else if (formData.avatar) {
        // If a predefined avatar is selected, use its URL in Base64 format
        avatarBase64 = await convertImageToBase64(formData.avatar);
      }

      if (avatarBase64) {
        formDataToSend.append("pic", avatarBase64);
      }

      // Sending the form data to the server
      const response = await fetch(
        `${config.apiUrl}/admin-student-crud/?id=${S.id}`,
        {
          method: "PUT",
          body: formDataToSend,
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error("Failed to update profile: " + (errorData?.pic?.[0] || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Convert predefined avatar image to Base64 format
 

  return (
    <>
          <ToastContainer />
    <div className="flex flex-col min-h-screen bg-gray-50">
                <DashboardHeader user={S} />

      <div className="flex flex-row flex-grow">
        <Sidebar />
        <div className="flex-grow ml-64 p-4">

          <div className="max-w-screen-lg mx-auto bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 mb-2">Avatar</label>
                <AvatarSelector onSelect={handleAvatarSelect} />
                <label className="mt-4 text-gray-600">Or upload your own image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
                {formData.customAvatar && (
                  <img
                    src={formData.customAvatar}
                    alt="Custom Avatar"
                    className="w-16 h-16 rounded-full mt-4"
                  />
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-600">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default Profile;
