import React from "react";
import {
  FaChalkboardTeacher,
  FaChartBar,
  FaGlobe,
  FaClipboardCheck,
} from "react-icons/fa"; // Example icons
import { Link } from "react-router-dom";

const WhyUs = () => {
  return (
    <section className="why-us" id="why-us">
      <div className="why-us-container bg-white py-16 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side: Heading and Description */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-8 flex flex-col justify-center">
            <h2 className="text-5xl font-bold mb-6">
              Why Choose <span className="text-[#007bff]">Mock Period?</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              With thousands of students benefiting from our mock tests and
              detailed analytics, Mock Period is your ideal platform for exam
              preparation.
            </p>
            {/* Smaller Button */}
            <div className="text-center mb-10 md:text-left">
              <Link
                to="/login"
                className="bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Side: Cards with different sizes */}
          <div className="max-w-7xl lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 (Bottom aligned with Card 2) */}
            <div className="flex items-center p-6 bg-green-100 rounded-lg shadow-lg h-48 transition-transform transform hover:scale-105 hover:shadow-xl">
              <FaChalkboardTeacher className="text-4xl text-green-600 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Learn from the Best</h3>
                <p className="text-gray-600">
                  Learn from the masters of the subject, in the most engaging
                  yet simplified ways.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center p-6 bg-red-100 rounded-lg shadow-lg h-56 transition-transform transform hover:scale-105 hover:shadow-xl">
              <FaClipboardCheck className="text-4xl text-red-600 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Live Tests for Real Exam</h3>
                <p className="text-gray-600">
                  Improve your time & pressure management skills.
                </p>
              </div>
            </div>

            {/* Card 3 (Top aligned with Card 4) */}
            <div className="flex items-center p-6 bg-purple-100 rounded-lg shadow-lg h-56 transition-transform transform hover:scale-105 hover:shadow-xl">
              <FaChartBar className="text-4xl text-yellow-600 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Detailed Score Analysis</h3>
                <p className="text-gray-600">
                  Get a detailed breakdown of your strengths & weaknesses and
                  insights to improve your score.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-center p-6 bg-yellow-100 rounded-lg shadow-lg h-48 transition-transform transform hover:scale-105 hover:shadow-xl">
              <FaGlobe className="text-4xl text-purple-600 mr-4" />
              <div>
                <h3 className="text-xl font-bold">Multilingual Support</h3>
                <p className="text-gray-600">
                  Choose from any of our 8 languages and learn comfortably.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
