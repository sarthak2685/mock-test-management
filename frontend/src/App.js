import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import ContactPage from './components/Contact.jsx';
import AdminDashboard from './components/AdminDasboard/AdminDasboard.jsx';
import StudentManagement from './components/AdminDasboard/StudentMangement.jsx';
import MockTestManagement from './components/AdminDasboard/MockTest.jsx';
import ChartComponent from './components/AdminDasboard/Perfomance.jsx';
import Dashboard from './components/AdminDasboard/Dasboard.jsx';
import MockDemo from './components/Home/Mock/mock-demo.jsx';
import StudentPerformance from './components/AdminDasboard/StudentPerformance.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Conditional Navbar and Footer */}
        {['/', '/login', '/contact'].includes(window.location.pathname) && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/create-test" element={<MockTestManagement />} />
          <Route path="/performance" element={<ChartComponent />} />
          < Route path='/mock-demo' element={<MockDemo />} />
          <Route path="/student-performance/:id" element={<StudentPerformance />} />
        </Routes>
        {['/', '/login', '/contact'].includes(window.location.pathname) && <Footer />}
      </div>
    </Router>
  );
}

export default App;
