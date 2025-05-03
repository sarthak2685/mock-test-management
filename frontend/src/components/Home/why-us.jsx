import React from "react";
import {
    FaChalkboardTeacher,
    FaChartBar,
    FaGlobe,
    FaClipboardCheck,
} from "react-icons/fa"; // Example icons
import { Link } from "react-router-dom";

const WhyUs = () => {
    return (
        <section className="why-us" id="why-us">
            <div className="why-us-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    {/* Left Side: Heading and Description */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
                            Why Choose{" "}
                            <span className="text-[#007bff]">Mock Period?</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-600 mb-6">
                            MockPeriod is your trusted companion for government
                            exam preparation, offering chapter-wise and
                            full-length mock tests designed according to the
                            latest exam patterns. With bilingual support
                            (English and Hindi), real-time performance analysis,
                            and expert-curated content, we make high-quality
                            test preparation affordable and accessible -
                            anytime, anywhere.
                        </p>
                        <div className="text-center lg:text-left">
                            <a
                                href="#subscription"
                                className="bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Cards with different sizes */}
                    <div className="max-w-7xl lg:w-4/6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:mt-8 mt-0">
                        {/* Card 1 */}
                        <div className="flex items-center p-6 bg-green-100 rounded-lg mt-8 shadow-lg h-48 transition-transform transform hover:scale-105 hover:shadow-xl">
                            <FaChalkboardTeacher className="text-4xl text-green-600 mr-4" />
                            <div>
                                <h3 className="text-xl font-bold">
                                    Learn from the Best
                                </h3>
                                <p className="text-gray-600">
                                    Learn from the masters of the subject, in
                                    the most engaging yet simplified ways.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex items-center p-6 bg-red-100 rounded-lg h-56 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                            <FaClipboardCheck className="text-4xl text-red-600 mr-4" />
                            <div>
                                <h3 className="text-xl font-bold">
                                    Live Tests for Real Exam
                                </h3>
                                <p className="text-gray-600">
                                    Improve your time & pressure management
                                    skills.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex items-center p-6 bg-purple-100 rounded-lg h-56 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                            <FaChartBar className="text-4xl text-yellow-600 mr-4" />
                            <div>
                                <h3 className="text-xl font-bold">
                                    Detailed Score Analysis
                                </h3>
                                <p className="text-gray-600">
                                    Get a detailed breakdown of your strengths &
                                    weaknesses and insights to improve your
                                    score.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="flex items-center p-6 bg-yellow-100 rounded-lg h-48 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                            <FaGlobe className="text-4xl text-purple-600 mr-4" />
                            <div>
                                <h3 className="text-xl font-bold">
                                    Multilingual Support
                                </h3>
                                <p className="text-gray-600">
                                    Learn comfortably and effectively in either
                                    Hindi or English.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
