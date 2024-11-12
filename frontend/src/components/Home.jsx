import React, { useEffect, useState } from "react";
import Banner from "./Home/banner.jsx";
import Subscription from "./Home/subscription.jsx";
import Exam from "./Home/exams.jsx";
import WhyUs from './Home/why-us.jsx'
import Message from './Home/message.jsx'
import FAQ from "./Home/faq.jsx";
import FreeMock from "./Home/free-mock.jsx";
import Cookies from 'js-cookie';


function Home() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')); // Fetch user data from localStorage
    console.log(userData);
    
    if (userData) {
      setUser(userData);
      setUserRole(userData.type); // Set user role based on type
      Cookies.set('loginToken', 'true', { expires: 1 }); // Set login cookie
    }
  }, []);
  const shouldRenderMockTest = userRole !== "student";



  return (
    <>
      <Banner />
      <Exam />
      {shouldRenderMockTest && <FreeMock />}
      <WhyUs />
      {shouldRenderMockTest &&<Subscription />}
      <FAQ />
      <Message />
    </>
  );
}

export default Home;
