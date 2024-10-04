import React from 'react';
import whyUsImage from '../../assets/why-us.png'; // Adjust the path if needed

const WhyUs = () => {
  return (
    <div className="why-us-container bg-white py-10 px-4">
      <div className="container mx-auto">
        
        {/* Centered Heading */}
        <h1 className="text-6xl tracking-tight font-extrabold text-gray-900 mb-8 text-center">
          Why Choose <span className="text-[#007bff]">Us</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8">
          
          {/* Left side: Image */}
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0 flex justify-center lg:justify-start">
            <img 
              src={whyUsImage} 
              alt="Why Us" 
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto rounded-lg" /> {/* Responsive image */}
          </div>
          
          {/* Right side: Content */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start items-center">
              
              {/* First point */}
              <div className="w-full sm:w-1/2 lg:w-64 m-2 p-6 bg-blue-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">10+ Exams</h3>
                <p className="text-sm">
                  We provide mock tests for over 10+ competitive exams, helping you prepare comprehensively.
                </p>
              </div>

              {/* Second point */}
              <div className="w-full sm:w-1/2 lg:w-64 m-2 p-6 bg-blue-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Affordable Pricing</h3>
                <p className="text-sm">
                  Get access to detailed analytics and personalized tracking at the most affordable rates.
                </p>
              </div>

              {/* Third point */}
              <div className="w-full sm:w-1/2 lg:w-64 m-2 p-6 bg-blue-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Comprehensive Reports</h3>
                <p className="text-sm">
                  Detailed reports that track your progress and help identify areas of improvement.
                </p>
              </div>

              {/* Fourth point */}
              <div className="w-full sm:w-1/2 lg:w-64 m-2 p-6 bg-blue-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-sm">
                  Our experts are available to guide you through every step of your exam preparation journey.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
