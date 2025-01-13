import React, { useState } from "react";
import boy1 from "../assets/boy1.jpg";
import boy2 from "../assets/boy2.jpg";
import boy3 from "../assets/boy3.jpg";
import girl1 from "../assets/girl1.jpg";
import girl2 from "../assets/girl2.jpg";
import girl3 from "../assets/girl3.jpg";


const Avatars = ({ onSelect }) => {
  // Define the avatar options for boys and girls with unique styles and image paths
  const avatarOptions = [
    {
      id: 1,
      label: "Boy with Spectacles",
      name: "John Doe",
      image: boy1, // Path to the boy1 image in the assets folder
      size: 50,
      style: { border: "2px solid black" }
    },
    {
      id: 2,
      label: "Boy Casual",
      name: "David Smith",
      image: boy2, // Path to the boy2 image in the assets folder
      size: 50,
      style: { border: "2px solid gray" }
    },
    {
      id: 3,
      label: "Boy with Blonde Hair",
      name: "James Bond",
      image: boy3, // Path to the boy3 image in the assets folder
      size: 50,
      style: { border: "2px solid orange" }
    },
    {
      id: 4,
      label: "Girl with Spectacles",
      name: "Alice Cooper",
      image: girl1, // Path to the girl1 image in the assets folder
      size: 50,
      style: { border: "2px solid purple" }
    },
    {
      id: 5,
      label: "Girl with Casual Look",
      name: "Emma Stone",
      image: girl2, // Path to the girl2 image in the assets folder
      size: 50,
      style: { border: "2px solid teal" }
    },
    {
      id: 6,
      label: "Girl with Blonde Hair",
      name: "Sophia Loren",
      image: girl3, // Path to the girl3 image in the assets folder
      size: 50,
      style: { border: "2px solid pink" }
    }
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar);
    onSelect(avatar); // Send the selected avatar's details to the parent
  };

  return (
    <div>
      <h3 className="font-bold mb-4">Choose an Avatar</h3>
      <div className="flex space-x-4">
        {avatarOptions.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => handleSelect(avatar)}
            className={`cursor-pointer p-2 border-2 rounded ${
              selectedAvatar.id === avatar.id ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <img
              src={avatar.image}
              alt={avatar.label}
              style={{
                width: avatar.size,
                height: avatar.size,
                borderRadius: "50%",
                border: avatar.style.border
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4>Preview:</h4>
        <img
          src={selectedAvatar.image}
          alt={selectedAvatar.label}
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "2px solid black"
          }}
        />
      </div>
    </div>
  );
};

export default Avatars;
