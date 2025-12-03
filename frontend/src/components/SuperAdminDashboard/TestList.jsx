import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

const TestList = () => {
  const [tests, setTests] = useState({});
  const [subjectTests, setSubjectTests] = useState({});
  const [testExamIds, setTestExamIds] = useState({}); // Store test name to exam ID mapping
  const [testSubjectIds, setTestSubjectIds] = useState({}); // Store test name to subject ID mapping
  const [loading, setLoading] = useState(false);
  const [deleteTestName, setDeleteTestName] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [selectedTestName, setSelectedTestName] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null); // Store the selected exam ID
  const [selectedSubjectId, setSelectedSubjectId] = useState(null); // Store the selected subject ID
  const [isSubjectTest, setIsSubjectTest] = useState(false); // Flag to check if it's a subject test
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const didFetch = useRef(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.token;
  const API_URL = `${config.apiUrl}/tests/`;

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

const fetchTests = useCallback(async () => {
  if (!token) return;
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${config.apiUrl}/tests/exam-type/EXAM_WISE`,
      { headers: { Authorization: `Token ${token}` } }
    );

    // Group by examName
    const grouped = data.reduce((acc, item) => {
      if (!item.examName) return acc;
      if (!acc[item.examName]) acc[item.examName] = [];
acc[item.examName].push({
  id: item.id,
  name: item.testName
});
      return acc;
    }, {});

    // Map test -> examId
    const examMap = data.reduce((acc, item) => {
      acc[item.testName] = item.examId;
      return acc;
    }, {});

    setTests(grouped);
    setTestExamIds(examMap);
  } catch (err) {
    toast.error("Failed to fetch exam-based tests");
  } finally {
    setLoading(false);
  }
}, [token]);


const fetchSubjectTests = useCallback(async () => {
  if (!token) return;
  try {
    const { data } = await axios.get(
      `${config.apiUrl}/tests/exam-type/SUBJECT_WISE`,
      { headers: { Authorization: `Token ${token}` } }
    );

    // Group by subjectName (single subject per test)
    const grouped = data.reduce((acc, item) => {
      if (!item.subjectName) return acc;
      if (!acc[item.subjectName]) acc[item.subjectName] = [];
      acc[item.subjectName].push({
        id: item.id,
        name: item.testName,
        subjectId: item.subjectId, // Add subjectId for edit functionality
        durationMinutes: item.durationMinutes,
        language: item.language,
        chapterNames: item.chapterNames
      });
      return acc;
    }, {});

    // Map test -> subjectId
    const subjectMap = data.reduce((acc, item) => {
      acc[item.testName] = item.subjectId;
      return acc;
    }, {});

    setSubjectTests(grouped);
    setTestSubjectIds(subjectMap);
  } catch (err) {
    toast.error("Failed to fetch subject-based tests");
  }
}, [token]);


  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchTests();
    fetchSubjectTests();
  }, [fetchTests, fetchSubjectTests]);

  const confirmDelete = (testName) => {
    setDeleteTestName(testName);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTestName) return;

    try {
      await axios.delete(`${API_URL}${deleteTestName}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success("Test deleted successfully");
      fetchTests();
      fetchSubjectTests();
    } catch (error) {
      toast.error("Failed to delete test");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTestName(null);
    }
  };

const handleEdit = (test) => {
  console.log("Editing test ID:", test.id);

  setSelectedTestId(test.id);        // ⭐ store test id
  setSelectedTestName(test.name);

  if (test.subjectId) {
    setSelectedSubjectId(test.subjectId);
    setIsSubjectTest(true);
       setSubjectId(test.id)

  } else {
    setSelectedExamId(test.examId);
    setSubjectId(test.id)
    setIsSubjectTest(false);
    setSelectedExamId(testExamIds[test.name]);
  }

  setIsLangModalOpen(true);
};



  return (
    <>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-grow transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-0" : "ml-64"
        }`}
      >
        <Header user={S?.name} toggleSidebar={toggleSidebar} />
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-6">
            Available Tests
          </h1>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              {/* Exam-Based Tests */}
              {Object.keys(tests).length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold mt-4 mb-3">
                    Tests by Exam
                  </h2>
                  {Object.entries(tests).map(([exam, testList]) => (
                    <div key={exam} className="mb-6">
                      <h3 className="font-bold text-lg text-gray-700">
                        {exam}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                       {testList.map((test) => (
  <div key={test.id} className="shadow-md p-4 flex justify-between items-center bg-white border rounded-lg">
    <div className="text-lg font-medium">{test.name}</div>
    <div className="flex gap-3 items-center">
      <FiEdit
        className="text-blue-600 cursor-pointer hover:text-blue-800"
        size={20}
        onClick={() => handleEdit(test)}
      />
      <FiTrash2
        className="text-red-600 cursor-pointer hover:text-red-800"
        size={20}
        onClick={() => confirmDelete(test.id)}
      />
    </div>
  </div>
))}

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No exam-based tests available
                </p>
              )}

              <hr className="w-full text-black border-black border-t-2" />

              {/* Subject-Based Tests */}
{Object.keys(subjectTests).length > 0 ? (
  <div>
    <h2 className="text-xl font-semibold mt-6 mb-3">
      Tests by Subject
    </h2>
    {Object.entries(subjectTests).map(([subject, testList]) => (
      <div key={subject} className="mb-6">
        <h3 className="font-bold text-lg text-gray-700">
          {subject}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {testList.map((test) => (
            <div key={test.id} className="shadow-md p-4 flex justify-between items-center bg-white border rounded-lg">
              <div className="text-lg font-medium">{test.name}</div>
              <div className="flex gap-3 items-center">
                <FiEdit 
                  size={20} 
                  className="text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={() => handleEdit(test)} // Pass full test object
                />
                <FiTrash2 
                  size={20} 
                  className="text-red-600 cursor-pointer hover:text-red-800"
                  onClick={() => confirmDelete(test.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-gray-500">
    No subject-based tests available
  </p>
)}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete "<b>{deleteTestName}</b>"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal - Modified for both Exam and Subject tests */}
      {isLangModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Select Language
            </h2>
            <p className="text-gray-700 mb-4 text-center">
              Choose the language for "<b>{selectedTestName}</b>"
            </p>
            <div className="flex justify-center gap-4">
              {isSubjectTest ? (
                // Links for subject tests
                <>
                  <Link
                    to={`/chapter-view?test=${selectedTestName}&lang=english&subject_id=${subjectId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
                    onClick={() => setIsLangModalOpen(false)}
                  >
                    English
                  </Link>
                  <Link
                    to={`/chapter-view?test=${selectedTestName}&lang=hindi&subject_id=${subjectId}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-center"
                    onClick={() => setIsLangModalOpen(false)}
                  >
                    Hindi
                  </Link>
                </>
              ) : (
                // Links for exam tests
                <>
                  <Link
  to={`/view?test=${selectedTestName}&exam_id=${selectedExamId}&test_id=${selectedTestId}&language=ENGLISH`}
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
  onClick={() => setIsLangModalOpen(false)}
>
  English
</Link>

<Link
  to={`/view?test=${selectedTestName}&exam_id=${selectedExamId}&test_id=${selectedTestId}&language=HINDI`}
  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-center"
  onClick={() => setIsLangModalOpen(false)}
>
  Hindi
</Link>

                </>
              )}
            </div>
            <button
              className="mt-4 block mx-auto px-4 py-2 text-sm text-gray-600 hover:underline"
              onClick={() => setIsLangModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TestList;
