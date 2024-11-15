import React from "react";
import { useParams, Link } from "react-router-dom";

const subjectChapters = {
  Maths: [
    { id: 1, name: "Algebra" },
    { id: 2, name: "Geometry" },
    { id: 3, name: "Trigonometry" },
    { id: 4, name: "Calculus" },
  ],
  Science: [
    { id: 1, name: "Physics" },
    { id: 2, name: "Chemistry" },
    { id: 3, name: "Biology" },
  ],
  English: [
    { id: 1, name: "Grammar" },
    { id: 2, name: "Literature" },
    { id: 3, name: "Comprehension" },
  ],
  // Add more subjects and chapters as needed
};

const Chapters = () => {
  const { subjectName } = useParams();
  const chapters = subjectChapters[subjectName] || [];

  return (
    <div className="relative bg-gray-100 min-h-screen overflow-hidden">
      {/* 3D Pattern in the Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500 to-yellow-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500 to-teal-500 opacity-30 transform rotate-45 z-0" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500 to-red-500 opacity-30 transform rotate-45 z-0" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 capitalize">
          {subjectName} Chapters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="relative bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-blue-600">{chapter.name}</h3>
                  <p className="text-gray-500 mt-2">
                    Dive into the concepts and practice questions to enhance your skills.
                  </p>
                </div>
                <Link
                  to={`/instruction`}
                  className="inline-block bg-[#007bff] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-center"
                >
                  Take Test
                </Link>
              </div>
              <div className="absolute top-0 right-0 -mr-3 -mt-3 bg-yellow-400 text-xs font-bold text-gray-800 py-1 px-3 rounded-full shadow-md">
                Chapter {chapter.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chapters;
