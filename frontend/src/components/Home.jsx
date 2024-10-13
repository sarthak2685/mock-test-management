import React from "react";
import Banner from "./Home/banner.jsx";
import Subscription from "./Home/subscription.jsx";
import Exam from "./Home/exams.jsx";
import WhyUs from './Home/why-us.jsx'
import Message from './Home/message.jsx'
import FAQ from "./Home/faq.jsx";
import FreeMock from "./Home/free-mock.jsx";


function Home() {
  return (
    <>
      <Banner />
      <Exam />
      <FreeMock />
      <WhyUs />
      <Subscription />
      <FAQ />
      <Message />
    </>
  );
}

export default Home;
