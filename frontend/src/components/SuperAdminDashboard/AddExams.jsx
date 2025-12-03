import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import config from "../../config";

export default function AddExams() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [showExamModal, setShowExamModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const [examName, setExamName] = useState("");
  const [examLogo, setExamLogo] = useState(null);
  const [editingExamIndex, setEditingExamIndex] = useState(null);

  const [selectedExamId, setSelectedExamId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [editingSubjectIndex, setEditingSubjectIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subjectId, setSubjectId] = useState("");
const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  // ================================
  // 📌 ADD / UPDATE EXAM (with API)
  // ================================
  const handleExamSubmit = async () => {
    const formData = new FormData();
    // formData.append("examName", examName);
     const examData = {
    examName,
  };

  formData.append("examData", JSON.stringify(examData)); // 👈 JSON inside FormData
  if (examLogo) formData.append("examImage", examLogo);

    try {
      if (editingExamIndex !== null) {
        // UPDATE exam
        const id = exams[editingExamIndex].id;
        const response = await axios.put(`${config.apiUrl}/exams`, formData);
        const updated = [...exams];
        updated[editingExamIndex] = response.data;
        fetchExams()

      } else {
        // ADD exam
        const response = await axios.post(`${config.apiUrl}/exams`,
             formData,
             {
          headers: {
            Authorization: `${token}`,
          },
        });
        fetchExams();
      }
    } catch (error) {
      console.error("Exam API Error:", error);
    }

    setShowExamModal(false);
    resetExamForm();
  };
//get subjects
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/subjects`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setSubjects(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }
  useEffect(() => {
    fetchSubjects();
  }, []);
  //get exam 
  const fetchExams = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/exams`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setExams(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const resetExamForm = () => {
    setExamName("");
    setExamLogo(null);
    setEditingExamIndex(null);
  };

  // ================================
  // 📌 DELETE EXAM
  // ================================
  const deleteExam = async (id, index) => {
    try {
      await axios.delete(`${config.apiUrl}/exams/${id}`);
      setExams(exams.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Delete Exam Error:", error);
    }
  };

  // ================================
  // 📌 ADD / UPDATE SUBJECT
  // ================================
const handleSubjectSubmit = async () => {
  try {
    if (!selectedExamId) {
      alert("Please select exam");
      return;
    }
    if (!subjectId) {
      alert("Please select subject");
      return;
    }



    let response;
    if (editingSubjectIndex !== null) {
      // UPDATE subject
      response = await axios.put(
        `${config.apiUrl}/exams/${selectedExamId}`,
        payload,
        { headers: { Authorization: token } }
      );

      const updated = [...subjects];
      updated[editingSubjectIndex] = response.data;
      setSubjects(updated);
    } else {
      // ADD subject
      response = await axios.post(
        `${config.apiUrl}/exams/${selectedExamId}/subjects`,
        [Number(subjectId)],
        { headers: { Authorization: token } }
      );

      setSubjects([...subjects, response.data]);
    }
  } catch (error) {
    console.error("Subject API Error:", error);
  }

  setShowSubjectModal(false);
  resetSubjectForm();
};


  const resetSubjectForm = () => {
    setSelectedExamId("");
    setSubjectName("");
    setEditingSubjectIndex(null);
  };

  // ================================
  // 📌 DELETE SUBJECT
  // ================================
  const deleteSubject = async (id, index) => {
    try {
      await axios.delete(`${config.apiUrl}/subjects/${id}`);
      setSubjects(subjects.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Delete Subject Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-grow transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-0" : "ml-64"
        }`}
      >
        <div className="p-6 max-w-3xl mx-auto">
          {/* ===================== Add Exam Section ===================== */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Exam Management</h1>
            <button
              onClick={() => setShowExamModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaPlus /> Add Exam
            </button>
          </div>

          {/* Exam List */}
          <div className="space-y-3">
            {exams.map((ex, index) => (
              <div
                key={ex.id}
                className="flex justify-between items-center p-3 border rounded-md bg-white"
              >
                <div className="flex gap-3 items-center">
                  {/* {ex.logo && (
                    <img
                      src={ex.logo}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  )} */}
                  <span className="font-medium">{ex.examName}</span>
                </div>

                <div className="flex gap-3 text-blue-600">
                  <FaEdit
                    className="cursor-pointer"
                    onClick={() => {
                      setEditingExamIndex(index);
                      setExamName(ex.name);
                      setExamLogo(null);
                      setShowExamModal(true);
                    }}
                  />
                  <FaTrash
                    className="cursor-pointer text-red-600"
                    onClick={() => deleteExam(ex.id, index)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ===================== Add Subject Section ===================== */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Subject Management</h2>

            <button
              onClick={() => setShowSubjectModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaPlus /> Add Subject
            </button>

            {/* Subjects List */}
            <div className="mt-5 space-y-4">
              {exams.map((ex) => (
                <div key={ex.id} className="border rounded-md p-3 bg-white">
                  <h3 className="font-bold">{ex.examName}</h3>
                  {/* image url */}
                  {/* <div className="w-40 h-20 mt-2">
                    <img src={ex.examImageUrl} alt="" />
                  </div> */}
                 <ul className="ml-5 mt-2 space-y-2">
  {ex.subjectNames && ex.subjectNames.length > 0 ? (
    ex.subjectNames.map((sub, idx) => (
      <li
        key={idx}
        className="flex justify-between items-center"
      >
        <span>- {sub}</span>

        <div className="flex gap-3">
          <FaEdit
            className="cursor-pointer text-blue-600"
            onClick={() => {
              setEditingSubjectIndex(idx);
              setSelectedExamId(ex.id);
              setSubjectName(sub);
              setShowSubjectModal(true);
            }}
          />
          <FaTrash
            className="cursor-pointer text-red-600"
            onClick={() => deleteSubject(sub.id, idx)}
          />
        </div>
      </li>
    ))
  ) : (
    <li className="text-gray-400 italic">No subjects added</li>
  )}
</ul>

                </div>
              ))}
            </div>
          </div>

          {/* ===================== Exam Modal ===================== */}
          {showExamModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white p-6 w-80 rounded-lg shadow-xl space-y-4">
                <h2 className="text-lg font-semibold">
                  {editingExamIndex !== null ? "Update Exam" : "Add Exam"}
                </h2>

                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  placeholder="Exam Name"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setExamLogo(e.target.files[0])}
                  className="w-full"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    className="px-4 py-2"
                    onClick={() => setShowExamModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={handleExamSubmit}
                  >
                    {editingExamIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== Subject Modal ===================== */}
          {showSubjectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white p-6 w-80 rounded-lg shadow-xl space-y-4">
                <h2 className="text-lg font-semibold">
                  {editingSubjectIndex !== null ? "Update Subject" : "Add Subject"}
                </h2>

                <select
                  className="w-full border p-2 rounded-md"
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                >
                  <option value="">Select Exam</option>
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.examName}
                    </option>
                  ))}
                </select>

                {/* <input
                  type="text"
                  placeholder="Subject Name"
                  className="w-full border p-2 rounded-md"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                /> */}
              <select
  className="w-full border p-2 rounded-md"
  value={subjectId}
  onChange={(e) => setSubjectId(e.target.value)}
>
  <option value="">Select Subject</option>
  {subjects.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</select>


                <div className="flex justify-end gap-3 pt-2">
                  <button
                    className="px-4 py-2"
                    onClick={() => setShowSubjectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={handleSubjectSubmit}
                  >
                    {editingSubjectIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
