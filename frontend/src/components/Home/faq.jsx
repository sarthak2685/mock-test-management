import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import config from "../../config";

const FAQ = () => {
  const [faqData, setFaqData] = useState({}); // Store grouped FAQ data by type
  const [visibleSection, setVisibleSection] = useState(null); // Track the visible section
  const [activeIndex, setActiveIndex] = useState(null); // Track the expanded FAQ

  useEffect(() => {
    const fetchData = async () => {
      const url = `${config.apiUrl}/faqs/`;
      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Group data by 'types'
        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.types]) {
            acc[item.types] = [];
          }
          acc[item.types].push(item);
          return acc;
        }, {});

        setFaqData(groupedData); // Store grouped FAQs in state
        setVisibleSection(Object.keys(groupedData)[0]); // Set the first section as visible by default
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleFAQ = (index, section) => {
    setActiveIndex(activeIndex === `${section}-${index}` ? null : `${section}-${index}`);
  };

  return (
    <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="container px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Frequently Asked <span className="text-[#007bff]">Questions</span>
        </h1>
        <hr className="my-6" />

        <div className="mt-8 xl:mt-16 lg:flex lg:-mx-12">
          {/* Section Buttons on the left */}
          <div className="lg:mx-12">
            <h1 className="text-xl font-semibold">Table of Contents</h1>
            <div className="mt-4 space-y-4 lg:mt-8">
              {Object.keys(faqData).map((type, index) => (
                <div
                  key={index}
                  className={`py-6 px-4 rounded-lg text-sm shadow-md cursor-pointer opacity-50 transition-transform transform hover:scale-105 ${
                    visibleSection === type ? "border-b-2 opacity-100 font-semibold border-[#007bff]" : ""
                  }`}
                  onClick={() => setVisibleSection(type)}
                >
                  <h2 className={`text-left ${visibleSection === type ? "text-[#007bff]" : ""}`}>
                    {type}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Content on the right */}
          <div className="flex-1 mt-8 lg:mx-12 lg:mt-0">
            {faqData[visibleSection] && (
              <div>
                {faqData[visibleSection].map((faq, index) => (
                  <div key={faq.id}>
                    <button
                      className="flex items-center justify-between w-full focus:outline-none"
                      onClick={() => toggleFAQ(index, visibleSection)}
                    >
                      <h3 className="text-lg">{faq.question}</h3>
                      {activeIndex === `${visibleSection}-${index}` ? (
                        <AiOutlineMinus className="flex-shrink-0 w-6 h-6 text-[#007bff]" />
                      ) : (
                        <AiOutlinePlus className="flex-shrink-0 w-6 h-6 text-[#007bff]" />
                      )}
                    </button>
                    {activeIndex === `${visibleSection}-${index}` && (
                      <div className="flex mt-2 md:mx-6">
                        <span className="border border-[#007bff]"></span>
                        <p className="max-w-3xl px-4">{faq.answer}</p>
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