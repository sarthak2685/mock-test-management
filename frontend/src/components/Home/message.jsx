import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Message = () => {
  return (
    <div className="flex items-center justify-center  pb-20">
      <div className="text-center py-12">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Kick Start Your Preparation <span className='text-[#007bff]'>Today</span>
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl  mb-6">
          With Us
        </h2>

        {/* Footer Message */}
        <p className="text-sm text-gray-500 flex items-center justify-center">
          Made With <FaHeart className="text-[#007bff] mx-1" />In India
        </p>
      </div>
    </div>
  );
};

export default Message;
