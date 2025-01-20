import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "../src/components/UserContext/UserContext.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ContactPage from "./components/Contact.jsx";
import AdminManagement from "./components/SuperAdminDashboard/AdminManagement.jsx";
import StudentManagement from "./components/AdminDasboard/StudentMangement.jsx";
import MockTestManagement from "./components/SuperAdminDashboard/MockTest.jsx";
import ChartComponent from "./components/AdminDasboard/Perfomance.jsx";
import Dashboard from "./components/AdminDasboard/Dasboard.jsx";
import MockDemo from "./components/Home/Mock/mock-demo.jsx";
import StudentPerformance from "./components/AdminDasboard/StudentPerformance.jsx";
import SuperAdminDashboard from "./components/SuperAdminDashboard/SuperAdminDashboard.jsx";
import AdminDashboard from "./components/AdminDasboard/AdminDasboard.jsx";
import Dashboards from "./components/StudentDashboard/Dashboards.jsx";
import Performances from "./components/StudentDashboard/Performances.jsx";
import StudentPerformances from "./components/StudentDashboard/StudentPerformances.jsx";
import Profile from "./components/StudentDashboard/Profile.jsx";
import Help from "./components/AdminDasboard/Help.jsx";
import View from "./components/SuperAdminDashboard/View.jsx";
import AdminList from "./components/SuperAdminDashboard/AdminList.jsx";
import Chapters from "./components/Home/Chapeter.jsx";
import MockTest from "./components/Home/Mock/MockTest.jsx";
import ScoreCard from "./components/Home/Mock/Score.jsx";
import Instructions from "./components/Home/Mock/Instructions.jsx";
import MockChapter from "./components/Home/Mock/MockChapter.jsx";
import ChapterTestInstructions from "./components/Home/Mock/ChapterTestInstruction.jsx";
import SubscriptionForm from "./components/Home/SubscriptionForm.jsx";
import ExamDesktop from "./components/Home/FreeMock/ExamDesktop.jsx";
import ExamMobile from "./components/Home/FreeMock/ExamMobile.jsx";
import Analysis from "./components/Home/FreeMock/Analysis.jsx";
import GuestInstruction from "./components/Home/FreeMock/GuestInstruction.jsx";
import TestTime from "./components/SuperAdminDashboard/TestTime.jsx";
import ChapterScore from "./components/Home/Mock/ChapterScore.jsx";
import ChapterPerformance from "./components/StudentDashboard/SubjectPerformance.jsx";
import ChapterWise from "./components/StudentDashboard/ChapterWise.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import TermsAndConditions from "./components/TermConditon.jsx";
import Disclaimer from "./components/Disclaimer.jsx";

import ScrollToTop from "./components/ScrollToTop.jsx";
import RazorpayPayment from "./components/RazorpayPayment.jsx";
import NoticeOwner from "./components/SuperAdminDashboard/NoticeOwner.jsx";
import NoticeAdmin from "./components/AdminDasboard/NoticeAdmin.jsx";

import Announcement from "./components/AdminDasboard/Announcement.jsx";



function App() {
  const location = useLocation();

  const userRole = localStorage.getItem("userRole");

  const isNavbarFooterVisible =
    userRole !== "owner" &&
    userRole !== "admin" &&
    ["/", "/login", "/contact", "/subscriptionform"].includes(
      location.pathname
    );

  return (
    <UserProvider>
      <div className="App">
        <ScrollToTop /> {/* Scroll to top on route change */}
        {/* Conditional Navbar and Footer */}
        {isNavbarFooterVisible && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/create-test" element={<MockTestManagement />} />
          <Route path="/performance" element={<ChartComponent />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/admins-list" element={<AdminList />} />
          <Route path="/test-time" element={<TestTime />} />
          <Route
            path="/student-performance/:studentId"
            element={<StudentPerformance />}
          />
          <Route path="/mock-demo" element={<MockDemo />} />
          <Route path="/student-dashboard" element={<Dashboards />} />
          <Route path="/Exam-Wise-Performance" element={<Performances />} />
          <Route
            path="/student-performances/:category/:testName"
            element={<StudentPerformances />}
          />
          <Route
            path="/student-performances-chapter/:subjectName/:mockName/:chapterName"
            element={<ChapterWise />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/view" element={<View />} />
          <Route path="/chapters/:subjectName" element={<Chapters />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/score" element={<ScoreCard />} />
          <Route path="/instruction" element={<Instructions />} />
          <Route path="/chapter-exam" element={<MockChapter />} />
          <Route
            path="/chapterinstruction"
            element={<ChapterTestInstructions />}
          />
          <Route path="/subscriptionform" element={<SubscriptionForm />} />

          <Route path="/examdesktop" element={<ExamDesktop />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/guestinstruction" element={<GuestInstruction />} />

          <Route path="/scorecard" element={<ChapterScore />} />
          <Route
            path="/subject-Wise-Performance"
            element={<ChapterPerformance />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-condition" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/payment" element={<RazorpayPayment />} />
          <Route path="/notice-owner" element={<NoticeOwner />} />
          <Route path="/notice-admin" element={<NoticeAdmin />} />

          <Route path="/announcement" element={<Announcement />} />


        </Routes>
        {isNavbarFooterVisible && <Footer />}
      </div>
    </UserProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
