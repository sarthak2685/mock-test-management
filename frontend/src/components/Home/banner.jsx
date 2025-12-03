import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import mockTestImage from "../../assets/giff.gif"; // Image for when no student is logged in
import mockkTestImage from "../../assets/gifff.gif"; // Image for when student is logged in

function Banner() {
    const [isVisible, setIsVisible] = useState(false);
    const [userType, setUserType] = useState(null);
    const [bannerImage, setBannerImage] = useState(mockTestImage); // Default image

    const bannerRef = useRef(null);

    // Check localStorage for logged in user
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.role === "STUDENT") {
            setUserType(userData.type);
            setBannerImage(mockkTestImage); // If student is logged in, set the student image
        } else {
            setUserType(null);
            setBannerImage(mockTestImage); // If no student is logged in, use default image
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsVisible(true); // Trigger animation when the component is in the viewport
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the component is in the viewport
        );

        if (bannerRef.current) {
            observer.observe(bannerRef.current);
        }

        return () => {
            if (bannerRef.current) {
                observer.unobserve(bannerRef.current);
            }
        };
    }, []);

    return (
        <>
            <style>
                {`
          /* Add CSS for Continuous Animations with New Effects */
          @keyframes slideInBounce {
            0% {
              opacity: 0;
              transform: translateX(-100px);
            }
            50% {
              opacity: 1;
              transform: translateX(10px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-slideInBounce {
            animation: slideInBounce 1.5s ease-out;
          }

          @keyframes bounceText {
            0% {
              transform: translateY(10px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0);
            }
          }

          .animate-bounceText {
            animation: bounceText 1.5s ease-out infinite alternate;
          }

          @keyframes bounceIn {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0);
            }
          }

          .animate-bounceIn {
            animation: bounceIn 1s ease-in-out infinite;
          }

          .animate-bounceIn.delay-1 {
            animation-delay: 0.5s;
          }

          @keyframes bounceImage {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
            100% {
              transform: translateY(0);
            }
          }

          .animate-bounceImage {
            animation: bounceImage 1.2s ease-in-out infinite alternate;
          }

          @keyframes waveBackground {
            0% {
              transform: translateX(0);
              background-color: #f0f8ff;
            }
            50% {
              transform: translateX(-10px);
              background-color: #e0f7fa;
            }
            100% {
              transform: translateX(10px);
              background-color: #f0f8ff;
            }
          }

          .animate-waveBackground {
            animation: waveBackground 6s ease-in-out infinite;
          }
        `}
            </style>

            <section
                ref={bannerRef}
                className="bg-white py-16 md:py-16 relative overflow-hidden"
            >
                <div className="container mx-auto max-w-7xl sm:px-6 lg:px-6 py-8 bg-white  flex flex-col-reverse md:flex-row items-center">
                    <div
                        className={`w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0 relative z-10 ${
                            isVisible ? "animate-slideInBounce" : ""
                        }`}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-10">
                            Welcome to{" "}
                            <span className="text-[#007bff]">Mock Period</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-14 mt-[-1.5rem]">
                            Success in your government exams by preparing the
                            right way with MockPeriod. Our chapter-wise mock
                            tests and full-length mock tests are made to
                            challenge you, improve your skills, and build your
                            confidence. Each test you take moves you closer to
                            your goal. You have what it takes, and we're here to
                            help you get there.
                        </p>
                        <div className="text-center mb-10 md:text-left">
                            {!userType && (
                                <a
                                    href="#subscription"
                                    className="bg-[#007bff] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out animate-bounceIn delay-1"
                                >
                                    Get Your Plan
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center relative z-10">
                        <img
                            src={bannerImage} // Dynamically set the image based on login status
                            alt="Mock Test Platform"
                            className="w-3/4 h-auto animate-bounceImage"
                        />
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-50 transform-gpu -z-10 animate-waveBackground"></div>
            </section>
        </>
    );
}

export default Banner;
