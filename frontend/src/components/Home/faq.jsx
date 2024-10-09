import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'; // Importing icons from react-icons

const FAQ = () => {
  const [visibleSection, setVisibleSection] = useState('payment'); // Set 'payment' section to be visible initially
  const [activeIndex, setActiveIndex] = useState(null); // Add this to track which FAQ is expanded

  const paymentFAQs = [
    {
      question: "I do not have online payment activated, can I use any other mode for payment?",
      answer: "You can use alternative payment methods like UPI, net banking, or credit/debit card if online payments are not activated.",
    },
    {
      question: "My money got deducted twice while making the transaction, what should I do?",
      answer: "In case of duplicate deductions, the extra amount is generally refunded automatically within a few business days. If not, reach out to Mock Period's support team with your transaction ID.",
    },
    {
      question: "My transaction failed, but money got deducted from my account, what should I do?",
      answer: "If your transaction fails but the amount is deducted, it will typically be refunded within a few business days. For issues, contact Mock Period support.",
    },
    {
      question: "I entered wrong email-id and/or phone number while making the transaction, what should I do?",
      answer: "If incorrect details were entered, please contact Mock Period's support team immediately with your correct details and transaction ID for assistance.",
    },
    {
      question: "How can I apply for the refund?",
      answer: "Refunds can be applied through Mock Period's refund request page. Make sure to provide transaction details and the reason for your request.",
    },
    {
      question: "Will I get the refund if I want to stop using it before the Pass/Course expiry?",
      answer: "Refunds are subject to Mock Period's policy. Generally, refunds are not provided once you've started accessing the mock test series.",
    },
    {
      question: "Can I share my Mock Period account with my friend/relative?",
      answer: "Account sharing is against Mock Period's terms of service. Please refer to the policy for further details.",
    },
  ];

  const testFAQs = [
    {
      question: "Can I attempt a test multiple times?",
      answer: "The number of test attempts depends on the specific test policy. Some tests allow multiple attempts, while others may be restricted to one attempt.",
    },
    {
      question: "Can I download the question paper with solutions after the test?",
      answer: "Yes, Mock Period provides the option to download question papers with solutions after completing a test, depending on the test policy.",
    },
    {
      question: "Do you also provide solutions for the questions?",
      answer: "Yes, detailed solutions are provided for each question after completing the test on Mock Period.",
    },
    {
      question: "Will I get any report card after the test?",
      answer: "Yes, you will receive a detailed performance report after each test on Mock Period.",
    },
    {
      question: "Till when can I access the solutions and analysis of my attempted tests?",
      answer: "You can access the solutions and analysis until the validity period of your Pass or subscription.",
    },
    {
      question: "Will all of my attempted tests be available during the Pass validity period?",
      answer: "Yes, all your attempted tests will be accessible during the Pass validity period on Mock Period.",
    },
    {
      question: "I am not able to access My Tests, what should I do?",
      answer: "If you're unable to access your tests, try clearing your browser cache or contacting Mock Period support for further assistance.",
    },
    {
      question: "I do not have a computer; can I appear for the test through my phone?",
      answer: "Yes, Mock Period's platform is mobile-friendly, allowing you to take tests on your phone.",
    },
  ];

  const toggleSection = (section) => {
    setVisibleSection(section);
  };

  const toggleFAQ = (index, section) => {
    setActiveIndex(activeIndex === `${section}-${index}` ? null : `${section}-${index}`);
  };

  return (
    <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="container px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Frequently Asked <span className="text-[#007bff]">Questions</span></h1>
        <hr className="my-6 " />

        <div className="mt-8 xl:mt-16 lg:flex lg:-mx-12">
          {/* Section Buttons on the left */}
          <div className="lg:mx-12">
            <h1 className="text-xl font-semibold ">Table of Contents</h1>
            <div className="mt-4 space-y-4 lg:mt-8">
              {/* Payment FAQs Button */}
              <div
                className={` py-6 px-4 rounded-lg text-sm shadow-md cursor-pointer opacity-50 transition-transform transform hover:scale-105  ${
                  visibleSection === 'payment' ? 'border-b-2 opacity-100 font-semibold border-[#007bff] ' : ''
                }`}
                onClick={() => toggleSection('payment')}
              >
                <h2 className={`text-left ${visibleSection === 'payment' ? 'text-[#007bff]' : ''}`}>
                  Payment/Transaction FAQs
                </h2>
              </div>

              {/* Test FAQs Button */}
              <div
                className={` py-6 px-4 cursor-pointer text-sm rounded-lg shadow-md opacity-50  transition-transform transform hover:scale-105  ${
                  visibleSection === 'test' ? 'border-b-2 opacity-100 font-semibold border-[#007bff]' : ''
                }`}
                onClick={() => toggleSection('test')}
              >
                <h2 className={`text-left ${visibleSection === 'test' ? 'text-[#007bff]' : ''}`}>
                  Test FAQs
                </h2>
              </div>
            </div>
          </div>

          {/* FAQ Content on the right */}
          <div className="flex-1 mt-8 lg:mx-12 lg:mt-0">
            {visibleSection === 'payment' && (
              <div>
                <h2 className="text-xl font-bold mb-4 ">Payment/Transaction FAQs</h2>
                {paymentFAQs.map((faq, index) => (
                  <div key={index}>
                    <button
                      className="flex items-center justify-between w-full focus:outline-none"
                      onClick={() => toggleFAQ(index, 'payment')}
                    >
                      <h3 className="text-lg ">{faq.question}</h3>
                      {activeIndex === `payment-${index}` ? (
                        <AiOutlineMinus className="flex-shrink-0 w-6 h-6 text-[#007bff]" />
                      ) : (
                        <AiOutlinePlus className="flex-shrink-0 w-6 h-6 text-[#007bff]" />
                      )}
                    </button>
                    {activeIndex === `payment-${index}` && (
                      <div className="flex mt-2 md:mx-6">
                        <span className="border border-[#007bff]"></span>
                        <p className="max-w-3xl px-4 ">{faq.answer}</p>
                      </div>
                    )}
                    <hr className="my-8 " />
                  </div>
                ))}
              </div>
            )}

            {visibleSection === 'test' && (
              <div>
                <h2 className="text-xl font-bold mb-4 ">Test FAQs</h2>
                {testFAQs.map((faq, index) => (
                  <div key={index}>
                    <button
                      className="flex items-center justify-between w-full focus:outline-none"
                      onClick={() => toggleFAQ(index, 'test')}
                    >
                      <h3 className="text-lg ">{faq.question}</h3>
                      {activeIndex === `test-${index}` ? (
                        <AiOutlineMinus className="flex-shrink-0 w-6 h-6 text-[#007bff]" />
                      ) : (
                        <AiOutlinePlus className="flex-shrink-0 w-6 h-6 text-[#007bff]" />
                      )}
                    </button>
                    {activeIndex === `test-${index}` && (
                      <div className="flex mt-2 md:mx-6">
                        <span className="border border-[#007bff]"></span>
                        <p className="max-w-3xl px-4 ">{faq.answer}</p>
                      </div>
                    )}
                    <hr className="my-8" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
