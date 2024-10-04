import React from "react";
import Banner from "./Home/banner.jsx";
import Subscription from "./Home/subscription.jsx";
import Exam from "./Home/exams.jsx";
import WhyUs from './Home/why-us.jsx'
import Message from './Home/message.jsx'


function Home() {
  return (
    <>
      <Banner />
      <Subscription />
      <Exam />
    <WhyUs />
    <Message />
    </>
  );
}

export default Home;
