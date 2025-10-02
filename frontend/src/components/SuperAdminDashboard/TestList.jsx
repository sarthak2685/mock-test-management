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

  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.token;
  const API_URL = `${config.apiUrl}/delete_test_names/`;

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
      const { data } = await axios.get(`${config.apiUrl}/tests_point`, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log(data);

      const groupedTests = data.test_names
        .filter((test) => test.for_exam__name)
        .reduce((acc, test) => {
          acc[test.for_exam__name] = acc[test.for_exam__name] || [];
          acc[test.for_exam__name].push(test.test_name);
          return acc;
        }, {});

      // Create a mapping of test names to their exam IDs
      const testToExamIdMap = data.test_names.reduce((acc, test) => {
        if (test.for_exam_id && test.test_name) {
          acc[test.test_name] = test.for_exam_id;
        }
        return acc;
      }, {});

      // Create a mapping of test names to their subject IDs
      const testToSubjectIdMap = data.test_names_chapter.reduce((acc, test) => {
        if (test.for_exam_subjects_o__id && test.test_name) {
          acc[test.test_name] = test.for_exam_subjects_o__id;
        }
        return acc;
      }, {});

      setTestExamIds(testToExamIdMap);
      setTestSubjectIds(testToSubjectIdMap);
      setTests(groupedTests);
    } catch (error) {
      toast.error("Failed to fetch tests");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchSubjectTests = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${config.apiUrl}/get-test-by-subject-name/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const groupedSubjects = data.reduce((acc, subjectObj) => {
        const [subject, tests] = Object.entries(subjectObj)[0];
        acc[subject] = [...new Set(tests)];
        return acc;
      }, {});

      setSubjectTests(groupedSubjects);
    } catch (error) {
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
      await axios.delete(`${API_URL}?test_name=${deleteTestName}`, {
        headers: { Authorization: `Token ${token}` },
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

  const handleEdit = (testName) => {
    setSelectedTestName(testName);

    // Check if it's a subject test by checking if it has a subject ID mapping
    const subjectId = testSubjectIds[testName];

    if (subjectId) {
      // It's a subject test
      setSelectedSubjectId(subjectId);
      setIsSubjectTest(true);
      // Show language modal for subject tests too
      setIsLangModalOpen(true);
    } else {
      // It's an exam test
      setSelectedExamId(testExamIds[testName]);
      setIsSubjectTest(false);
      setIsLangModalOpen(true);
    }
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
                          <div
                            key={test}
                            className="shadow-md p-4 flex justify-between items-center bg-white border rounded-lg"
                          >
                            <div className="text-lg font-medium">{test}</div>
                            <div className="flex gap-3 items-center">
                              <FiEdit
                                className="text-blue-600 cursor-pointer hover:text-blue-800"
                                size={20}
                                onClick={() => handleEdit(test)}
                              />
                              <FiTrash2
                                className="text-red-600 cursor-pointer hover:text-red-800"
                                size={20}
                                onClick={() => confirmDelete(test)}
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
                          <div
                            key={test}
                            className="shadow-md p-4 flex justify-between items-center bg-white border rounded-lg"
                          >
                            <div className="text-lg font-medium">{test}</div>
                            <div className="flex gap-3 items-center">
                              <FiEdit
                                className="text-blue-600 cursor-pointer hover:text-blue-800"
                                size={20}
                                onClick={() => handleEdit(test)}
                              />
                              <FiTrash2
                                className="text-red-600 cursor-pointer hover:text-red-800"
                                size={20}
                                onClick={() => confirmDelete(test)}
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
                    to={`/chapter-view?test=${selectedTestName}&lang=english&subject_id=${selectedSubjectId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
                    onClick={() => setIsLangModalOpen(false)}
                  >
                    English
                  </Link>
                  <Link
                    to={`/chapter-view?test=${selectedTestName}&lang=hindi&subject_id=${selectedSubjectId}`}
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
                    to={`/view?test=${selectedTestName}&language=en&exam_id=${selectedExamId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
                    onClick={() => setIsLangModalOpen(false)}
                  >
                    English
                  </Link>
                  <Link
                    to={`/view?test=${selectedTestName}&language=hi&exam_id=${selectedExamId}`}
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
