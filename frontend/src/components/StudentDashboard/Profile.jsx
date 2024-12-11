import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebarr";
import DashboardHeader from "./DashboardHeaders";
import { BsPersonFill } from "react-icons/bs";
import { GiMale, GiFemale } from "react-icons/gi";


const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    type: "guest",
    user: "Guest",
    name: "Guest" // Default name for guest
  };
  // Ensure user object has valid properties or provide defaults
  const defaultUser = {
    name: "Guest",
    avatar: "",
    age: "",
    sex: "",
    mobile: "",
  };

  const safeUser = user ;

  const [formData, setFormData] = useState({
    name: safeUser.name || "",
    avatar: safeUser.avatar || "",
    age: safeUser.age || "",
    sex: safeUser.sex || "",
    mobile: safeUser.mobile || "",
  });

  const avatars = [
    { id: 1, avatarUrl: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads01&accessoriesType=RoundGlasses&hairColor=Brown&facialHairType=BeardMedium&clothingType=GraphicShirt&clothingColor=Blue01&eyeType=Happy&eyebrowType=UpDown&mouthType=Smile&skinColor=Light", label: "Male Avatar 1" },
    { id: 2, avatarUrl: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=RoundGlasses&hairColor=Brown&facialHairType=BeardMedium&clothingType=GraphicShirt&clothingColor=Red01&eyeType=Happy&eyebrowType=UpDown&mouthType=Smile&skinColor=Light", label: "Male Avatar 2" },
    { id: 3, avatarUrl: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight01&accessoriesType=RoundGlasses&hairColor=Black&facialHairType=Blank&clothingType=BlazerShirt&clothingColor=Pink&eyeType=Surprised&eyebrowType=UpDown&mouthType=Smile&skinColor=Light", label: "Male Avatar 3" },
    { id: 4, avatarUrl: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight02&accessoriesType=RoundGlasses&hairColor=Black&facialHairType=Blank&clothingType=BlazerShirt&clothingColor=Pink&eyeType=Surprised&eyebrowType=UpDown&mouthType=Smile&skinColor=Light", label: "Female Avatar 1" },
    { id: 5, avatarUrl: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight01&accessoriesType=RoundGlasses&hairColor=Blonde&facialHairType=Blank&clothingType=BlazerShirt&clothingColor=Pink&eyeType=Surprised&eyebrowType=UpDown&mouthType=Smile&skinColor=Light", label: "Female Avatar 2" },
    { id: 6, avatarUrl: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight02&accessoriesType=RoundGlasses&hairColor=Black&facialHairType=Blank&clothingType=GraphicShirt&clothingColor=Blue01&eyeType=Surprised&eyebrowType=UpDown&mouthType=Smile&skinColor=Light", label: "Female Avatar 3" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleAvatarSelect = (avatarIcon) => {
    setFormData({ ...formData, avatar: avatarIcon });
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
                <div className="flex space-x-4">
                {avatars.map((avatar) => (
                    <div
                      key={avatar.id}
                      onClick={() => handleAvatarSelect(avatar.avatarUrl)}
                      className={`cursor-pointer rounded-full p-2 border-2 ${formData.avatar === avatar.avatarUrl ? "border-blue-500" : "border-gray-300"}`}
                    >
                      <img src={avatar.avatarUrl} alt={avatar.label} className="w-12 h-12 rounded-full" />
                    </div>
                  ))}
                </div>
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
