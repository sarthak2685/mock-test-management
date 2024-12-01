import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../../config";

const Chapters = () => {
  const { subjectName } = useParams();
  const SubjectId = localStorage.getItem("selectedSubjectId");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/get-single-exam-details-based-on-subjects/?id=${SubjectId}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("API Response:", data); // Debug API response structure

        const formattedData =
          data?.data?.[0]?.chapters_details?.map((chapter) => ({
            ...chapter,
            testName: data?.data?.[0]?.test_name,
            examDuration: data?.data?.[0]?.exam_duration,
            noOfQuestions: data?.no_of_question,
          })) || []; // Fallback to an empty array if chapters_details is undefined

        setChapters(formattedData);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError("Failed to fetch chapters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (SubjectId) {
      fetchChapters();
    } else {
      setError("No subject selected.");
      setLoading(false);
    }
  }, [SubjectId]);

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-12">Loading chapters...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }
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
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(240, 240, 240, 0.5) 25%, transparent 25%, transparent 50%, rgba(240, 240, 240, 0.5) 50%, rgba(240, 240, 240, 0.5) 75%, transparent 75%, transparent)",
                backgroundSize: "20px 20px", // Adjust grid size
              }}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-center text-gray-800">
                    {chapter.testName || "N/A"}
                  </h3>
                  <div className="mt-4 text-gray-700">
                    <div className="flex items-center space-x-3 text-base">
                      <span className="text-blue-600 text-lg">
                        <strong>🕒</strong>
                      </span>
                      <span className="font-semibold">
                        {chapter.examDuration || "N/A"} mins
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-base mt-2">
                      <span className="text-green-600 text-lg">
                        <strong>📋</strong>
                      </span>
                      <span className="font-semibold">
                        {chapter.noOfQuestions || "N/A"} Questions
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/chapter-exam`}
                  className="inline-block bg-[#007bff] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-center"
                >
                  Take Test
                </Link>
              </div>
              <div className="absolute top-0 right-0 -mr-3 -mt-3 bg-yellow-400 text-xs font-bold text-gray-800 py-1 px-3 rounded-full shadow-md">
                {chapter.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chapters;
