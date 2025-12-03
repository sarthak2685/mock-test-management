import React, { useEffect, useState } from "react";
import Banner from "./Home/banner.jsx";
import Subscription from "./Home/subscription.jsx";
import Exam from "./Home/exams.jsx";
import WhyUs from "./Home/why-us.jsx";
import Message from "./Home/message.jsx";
import FAQ from "./Home/faq.jsx";
import FreeMock from "./Home/free-mock.jsx";
import Cookies from "js-cookie";
import Subject from "./Home/Subject.jsx";
import { Helmet } from "react-helmet-async";

function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")); // Fetch user data from localStorage

    if (userData) {
      setUser(userData);
      setUserRole(userData.role); // Set user role based on type
      Cookies.set("loginToken", "true", { expires: 1 }); // Set login cookie
    }
  }, []);
  const shouldRenderMockTest = userRole !== "STUDENT";

  return (
    <>
    <Helmet>
        <title>Mock Period - Free Mock Tests & Exam Preparation</title>
        <meta name="description" content="Take free mock tests, prepare for exams, and track your progress with Mock Period. Get real-time analytics and expert study materials." />
        <meta name="keywords" content="Mock tests, Free exam preparation, Online mock exams, Practice tests, Competitive exams, Study material" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mock Period Team" />
        <meta property="og:title" content="Mock Period - Free Mock Tests & Exam Preparation" />
        <meta property="og:description" content="Join thousands of students in preparing for competitive exams with free mock tests, study materials, and real-time analytics." />
        <meta property="og:url" content="https://mockperiod.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner />
      <Exam />
{/*       {shouldRenderMockTest && <FreeMock />}
       */}
      <Subject />
      {shouldRenderMockTest && <WhyUs />}
      {shouldRenderMockTest && <Subscription />}
      <FAQ />
      <Message />
    </>
  );
}

export default Home;
