// import React, { useState } from "react";
// import DashboardHeader from "./DashboardHeader";
// import Sidebar from "./Sidebar/SideBars";

// const MockTestManagement = ({ user }) => {
//   const [mockTests, setMockTests] = useState([
//     { id: 1, subject: "Math", questions: 10, duration: "30 mins" },
//   ]);

//   const [newTest, setNewTest] = useState({
//     subject: "",
//     questions: 0,
//     duration: "",
//   });

//   const handleAddTest = () => {
//     setMockTests([...mockTests, { ...newTest, id: mockTests.length + 1 }]);
//     setNewTest({ subject: "", questions: 0, duration: "" });
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col">
//         {/* Dashboard Header */}
//         <DashboardHeader user={user || { name: "Guest" }} />

//         {/* Page Content */}
//         <div className="p-6">
//           <h1 className="text-2xl font-bold mb-4">Create Mock Test</h1>

//           {/* Add Test Form */}
//           <div className="bg-white p-4 mb-6 shadow-md rounded-lg">
//             <input
//               type="text"
//               placeholder="Subject"
//               value={newTest.subject}
//               onChange={(e) =>
//                 setNewTest({ ...newTest, subject: e.target.value })
//               }
//               className="border p-2 mb-2 w-full"
//             />
//             <input
//               type="number"
//               placeholder="Number of Questions"
//               value={newTest.questions}
//               onChange={(e) =>
//                 setNewTest({ ...newTest, questions: +e.target.value })
//               }
//               className="border p-2 mb-2 w-full"
//             />
//             <input
//               type="text"
//               placeholder="Duration"
//               value={newTest.duration}
//               onChange={(e) =>
//                 setNewTest({ ...newTest, duration: e.target.value })
//               }
//               className="border p-2 mb-4 w-full"
//             />
//             <button
//               onClick={handleAddTest}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md"
//             >
//               Add Test
//             </button>
//           </div>

//           {/* Test List */}
//           <div className="bg-white p-4 shadow-md rounded-lg">
//             <h2 className="text-xl mb-4">Current Tests</h2>
//             <ul>
//               {mockTests.map((test) => (
//                 <li key={test.id} className="mb-2">
//                   {test.subject} - {test.questions} Questions - {test.duration}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MockTestManagement;
