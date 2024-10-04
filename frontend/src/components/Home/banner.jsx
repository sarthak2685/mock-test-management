import React from 'react';
import mockTestImage from '../../assets/mock.png';
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <section className="bg-white py-16 md:py-16">
      <div className="container mx-auto px-4 md:pr-4 md:pl-24 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
            Welcome to <span className="text-[#007bff]">Mock Period</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Prepare for your exams with our mock test series. Track your progress and improve your performance with detailed analytics.
          </p>
          <Link
            to="/login"
            className="bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out"
          >
            Get Started
          </Link>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={mockTestImage}
            alt="Mock Test Platform"
            className="w-3/4 h-auto  "
          />
        </div>
      </div>
    </section>
  );
}

export default Banner;
