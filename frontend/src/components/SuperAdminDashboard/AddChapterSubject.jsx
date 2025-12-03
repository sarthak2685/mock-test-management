import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Header from "./Header";
import Sidebar from "./Sidebar";
import config from "../../config";

export default function AddChapterSubject() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);

  const [subjectName, setSubjectName] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [chapterName, setChapterName] = useState("");

  const [editingSubjectIndex, setEditingSubjectIndex] = useState(null);
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

const S = JSON.parse(localStorage.getItem("user"));
  const token = S.token;
  
  const api = axios.create({
    baseURL: config.apiUrl,
    headers: { Authorization: `${token}` }
  });

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // ========================================================
  // 🔹 GET SUBJECTS + CHAPTERS
  // ========================================================
  const loadInitialData = async () => {
    try {
      const sub = await api.get("/subjects");
    //   const chap = await api.get("/add-chapter");
        console.log("chapters", sub.data);
      setSubjects(sub.data || []);
    //   setChapters(chap.data.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // ========================================================
  // 🔹 ADD / UPDATE SUBJECT
  // ========================================================
  const handleSubjectSubmit = async () => {
    try {
      if (editingSubjectIndex !== null) {
        // PUT
        const id = subjects[editingSubjectIndex].id;

        await api.put(`/add-subject/${id}`, { name: subjectName });

        const updated = [...subjects];
        updated[editingSubjectIndex].name = subjectName;
        setSubjects(updated);
      } else {
        // POST
        const res = await api.post("/subjects", { name: subjectName },
              {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        },
        );
        setSubjects([...subjects, res.data.data]);
      }
    } catch (err) {
      console.log("Subject API error:", err);
    }

    resetSubjectForm();
    setShowSubjectModal(false);
  };

  const resetSubjectForm = () => {
    setSubjectName("");
    setEditingSubjectIndex(null);
  };

  // ========================================================
  // 🔹 DELETE SUBJECT
  // ========================================================
  const deleteSubject = async (id, index) => {
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter((_, i) => i !== index));
    } catch (err) {
      console.log("Delete Subject error:", err);
    }
  };

  // ========================================================
  // 🔹 ADD / UPDATE CHAPTER
  // ========================================================
  const handleChapterSubmit = async () => {
    try {
      if (editingChapterIndex !== null) {
        const chapterId = chapters[editingChapterIndex].id;

        await api.put(`/chapters/${chapterId}`, {
          subjectId: selectedSubjectId,
          chapter: chapterName
        });

        const updated = [...chapters];
        updated[editingChapterIndex] = {
          ...updated[editingChapterIndex],
          subjectId: selectedSubjectId,
          name: chapterName
        };
        setChapters(updated);
      } else {
        const res = await api.post("/chapters", {
          subjectId: selectedSubjectId,
          name: chapterName
        });

        setChapters([...chapters, res.data.data]);
      }
    } catch (err) {
      console.log("Chapter API error:", err);
    }

    resetChapterForm();
    setShowChapterModal(false);
  };

  const resetChapterForm = () => {
    setSelectedSubjectId("");
    setChapterName("");
    setEditingChapterIndex(null);
  };

  const fetchChaptersBySubject = async (subjectId) => {
  try {
    const res = await api.get(`/chapters/subject/${subjectId}`);
    setChapters(res.data || []);  // response is array
    setSelectedSubjectId(subjectId); // to update UI for selected subject
  } catch (err) {
    console.log("Fetch chapter error:", err);
  }
};


  // ========================================================
  // 🔹 DELETE CHAPTER
  // ========================================================
  const deleteChapter = async (id, idx) => {
    try {
      await api.delete(`/add-chapter/${id}`);
      setChapters(chapters.filter((_, i) => i !== idx));
    } catch (err) {
      console.log("Delete Chapter error:", err);
    }
  };

  // ========================================================
  // UI SAME AS BEFORE — ONLY DELETE HANDLERS UPDATED
  // ========================================================
  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar}/>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}/>
      
      <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-64"}`}>
        <div className="p-6 max-w-3xl mx-auto">
          
          {/* SUBJECT SECTION */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Subject Management</h1>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaPlus /> Add Subject
            </button>
          </div>

          <div className="space-y-3">
           {subjects.map((s, index) => (
  <div key={s.id} className="flex justify-between items-center p-3 border rounded-md bg-white">
    <span className="font-medium">{s.name}</span>

    <div className="flex gap-3">
      {/* View Chapters */}
      <button
        className="px-3 py-1 bg-green-600 text-white rounded"
        onClick={() => fetchChaptersBySubject(s.id)}
      >
        View Chapters
      </button>

      <FaEdit
        className="cursor-pointer text-blue-600"
        onClick={() => {
          setEditingSubjectIndex(index);
          setSubjectName(s.name);
          setShowSubjectModal(true);
        }}
      />

      <FaTrash
        className="cursor-pointer text-red-600"
        onClick={() => deleteSubject(s.id, index)}
      />
    </div>
  </div>
))}

          </div>

          {/* CHAPTER SECTION */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Chapter Management</h2>

            <button
              onClick={() => setShowChapterModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaPlus /> Add Chapter
            </button>

           <div className="mt-5 space-y-4">
  {selectedSubjectId ? (
    <div className="border rounded-md p-3 bg-white">
      <h3 className="font-bold">
        Chapters for: {subjects.find(s => s.id === selectedSubjectId)?.name}
      </h3>

      {chapters.length === 0 ? (
        <p className="text-gray-500 mt-2">No chapters found.</p>
      ) : (
        <ul className="ml-5 mt-2 space-y-2">
          {chapters.map((c, idx) => (
            <li key={c.id} className="flex justify-between items-center">
              <span>• {c.name}</span>

              <div className="flex gap-3">
                <FaEdit
                  className="cursor-pointer text-blue-600"
                  onClick={() => {
                    setEditingChapterIndex(idx);
                    setSelectedSubjectId(c.subjectId);
                    setChapterName(c.name);
                    setShowChapterModal(true);
                  }}
                />

                <FaTrash
                  className="cursor-pointer text-red-600"
                  onClick={() => deleteChapter(c.id, idx)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : (
    <p className="text-gray-500">Click "View Chapters" on any subject to load its chapters.</p>
  )}
</div>

          </div>

          {/* SUBJECT MODAL */}
          {showSubjectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white p-6 w-80 rounded-lg shadow-xl space-y-4">
                <h2 className="text-lg font-semibold">
                  {editingSubjectIndex !== null ? "Update Subject" : "Add Subject"}
                </h2>

                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  placeholder="Subject Name"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowSubjectModal(false)}>Cancel</button>
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

          {/* CHAPTER MODAL */}
          {showChapterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white p-6 w-80 rounded-lg shadow-xl space-y-4">
                <h2 className="text-lg font-semibold">
                  {editingChapterIndex !== null ? "Update Chapter" : "Add Chapter"}
                </h2>

                <select
                  className="w-full border p-2 rounded-md"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  placeholder="Chapter Name"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowChapterModal(false)}>Cancel</button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={handleChapterSubmit}
                  >
                    {editingChapterIndex !== null ? "Update" : "Add"}
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
