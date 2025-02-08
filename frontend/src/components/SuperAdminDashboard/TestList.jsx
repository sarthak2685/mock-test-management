import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FiTrash2 } from "react-icons/fi";

const TestList = () => {
  const [tests, setTests] = useState({});
  const [subjectTests, setSubjectTests] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteTestName, setDeleteTestName] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const didFetch = useRef(false);

  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.token;
  const API_URL = `${config.apiUrl}/delete_test_names/`;

  // Toggle sidebar
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch tests grouped by exam
  const fetchTests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${config.apiUrl}/tests_point`, {
        headers: { Authorization: `Token ${token}` },
      });

      const groupedTests = data.test_names
        .filter((test) => test.for_exam__name)
        .reduce((acc, test) => {
          acc[test.for_exam__name] = acc[test.for_exam__name] || [];
          acc[test.for_exam__name].push(test.test_name);
          return acc;
        }, {});

      setTests(groupedTests);
    } catch (error) {
      toast.error("Failed to fetch tests");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch tests grouped by subject
  const fetchSubjectTests = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${config.apiUrl}/get-test-by-subject-name/`, {
        headers: { Authorization: `Token ${token}` },
      });

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

  // Prevent multiple API calls
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchTests();
    fetchSubjectTests();
  }, [fetchTests, fetchSubjectTests]);

  // Confirm delete modal
  const confirmDelete = (testName) => {
    setDeleteTestName(testName);
    setIsDeleteModalOpen(true);
  };

  // Handle delete request
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

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
        <Header user={S?.name} toggleSidebar={toggleSidebar} />
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Available Tests</h1>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              {/* Exam-Based Tests */}
              {Object.keys(tests).length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold mt-4 mb-3">Tests by Exam</h2>
                  {Object.entries(tests).map(([exam, testList]) => (
                    <div key={exam} className="mb-6">
                      <h3 className="font-bold text-lg text-gray-700">{exam}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {testList.map((test) => (
                          <div key={test} className="shadow-md p-4 flex justify-between items-center bg-white border rounded-lg">
                            <div className="text-lg font-medium">{test}</div>
                            <FiTrash2
                              className="text-red-600 cursor-pointer hover:text-red-800"
                              size={20}
                              onClick={() => confirmDelete(test)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No exam-based tests available</p>
              )}

              {/* Subject-Based Tests */}
              {Object.keys(subjectTests).length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">Tests by Subject</h2>
                  {Object.entries(subjectTests).map(([subject, testList]) => (
                    <div key={subject} className="mb-6">
                      <h3 className="font-bold text-lg text-gray-700">{subject}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {testList.map((test) => (
                          <div key={test} className="shadow-md p-4 flex justify-between items-center bg-white border rounded-lg">
                            <div className="text-lg font-medium">{test}</div>
                            <FiTrash2
                              className="text-red-600 cursor-pointer hover:text-red-800"
                              size={20}
                              onClick={() => confirmDelete(test)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No subject-based tests available</p>
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
            <p className="text-gray-700 mb-4">Are you sure you want to delete "<b>{deleteTestName}</b>"?</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestList;
