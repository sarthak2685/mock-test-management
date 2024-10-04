import React from "react";
import Banner from "./Home/banner.jsx";
import Subscription from "./Home/subscription.jsx";
import Exam from "./Home/exams.jsx";
import WhyUs from './Home/why-us.jsx'


function Home() {
  return (
    <>
      <Banner />
      <Subscription />
      <Exam />
    <WhyUs />
    </>
  );
}

export default Home;
