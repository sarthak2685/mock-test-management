import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";

function Subscription() {
  return (
    <section className="bg-white ">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:pb-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900 ">
            Subscription
            <span className="text-[#007bff]"> Plan</span>
          </h1>
          <h6 className="mb-5 font-light text-gray-500 sm:text-xl ">
            Get access to premium mock tests.
          </h6>
        </div>
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pricing Card 1 */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center bg-white rounded-lg border border-gray-200 shadow-md ">
            <h3 className="mb-4 text-2xl font-semibold text-gray-900 ">
              Basic Plan
            </h3>
            <p className="font-light text-gray-500 sm:text-lg ">
              For those who are serious about their preparation.
            </p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">₹749</span>
              <span className="text-gray-500 ">/month</span>
            </div>
            {/* List */}
            <ul className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-500" />
                <span>500+ Practice Questions</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaTimesCircle className="text-red-500 " />
                <span>Detailed Explanations</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-500 " />
                <span>Basic Progress Tracking</span>
              </li>
              <li className="flex items-center space-x-3">
                <AiOutlineQuestionCircle className="text-gray-400 " />
                <span>Standard Support</span>
              </li>
            </ul>
            <button className="text-white bg-[#007bff] hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Subscribe Now
            </button>
          </div>
          {/* Pricing Card 2 */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center bg-white rounded-lg border border-gray-200 shadow-md ">
            <h3 className="mb-4 text-2xl font-semibold text-gray-900 ">
              Standard Plan
            </h3>
            <p className="font-light text-gray-500 sm:text-lg ">
              For those who are serious about their preparation.
            </p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">₹1,499</span>
              <span className="text-gray-500 ">/month</span>
            </div>
            {/* List */}
            <ul className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-500 " />
                <span>1000+ Practice Questions</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-500 " />
                <span>Detailed Explanations</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-500 " />
                <span>Advanced Progress Tracking</span>
              </li>
              <li className="flex items-center space-x-3">
                <AiOutlineQuestionCircle className="text-gray-400 " />
                <span>Priority Support</span>
              </li>
            </ul>
            <button className="text-white bg-[#007bff] hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscription;
