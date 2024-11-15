import React from "react";
import { useLocation, Link } from "react-router-dom";

const MockTest = () => {
  const { state } = useLocation();
  const { exam } = state;

  const mockTestData = [
    { id: 1, name: "Mock Test 1", subject: "Math,English", time: "30 mins", questions: 20 },
    { id: 2, name: "Mock Test 2", subject: "English", time: "30 mins", questions: 20 },
    { id: 3, name: "Mock Test 3", subject: "General Knowledge", time: "30 mins", questions: 20 },
    { id: 4, name: "Mock Test 4", subject: "All Subjects", time: "1 hour", questions: 50 },
  ];

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500 to-yellow-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500 to-teal-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500 to-red-500 opacity-30 transform rotate-45 z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 capitalize">
          {exam.name} Mock Tests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {mockTestData.map((test) => (
            <div
              key={test.id}
              className="relative p-8 rounded-2xl shadow-lg transform transition duration-500 ease-in-out hover:scale-105 hover:rotate-1 hover:-translate-y-1 hover:shadow-2xl card-3d"
            >
              <div className="relative z-20 flex flex-col justify-between h-full p-4">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{test.name}</h3>
                  <p className="text-gray-500 mt-2 font-semibold">
                    Subject: {test.subject} <br />
                    <span className="text-gray-500 mt-2 flex items-center font-semibold">
                      🕒 {test.time}
                    </span>
                    <span className="text-gray-500 mt-2 flex items-center font-semibold">
                      📋 {test.questions} Questions
                    </span>
                  </p>
                </div>
                <Link
                  to={`/instruction`}
                  className="inline-block bg-[#007bff] text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-300 text-center text-sm"
                >
                  Start Test
                </Link>
              </div>
              <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold text-gray-800 py-1 px-3 rounded-full shadow-md z-20">
                Test {test.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .card-3d {
          background-color: #ffffff;
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
        }

        .card-3d::before,
        .card-3d::after {
          content: '';
          position: absolute;
          width: 150%;
          height: 150%;
          background-image: repeating-linear-gradient(
            45deg,
            #f0f0f0 0px,
            #f0f0f0 10px,
            #ffffff 10px,
            #ffffff 20px
          );
          opacity: 0.2;
          transform: rotate(45deg);
          border-radius: 1rem;
        }

        .card-3d::before {
          top: -75%;
          left: -75%;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .card-3d::after {
          bottom: -75%;
          right: -75%;
          box-shadow: 0 -10px 15px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MockTest;
