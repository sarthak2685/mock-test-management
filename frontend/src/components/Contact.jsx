import React from 'react';

const ContactForm = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-300 to-blue-100 opacity-50 rounded-full transform -translate-x-24 -translate-y-20 "></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-300 to-blue-100 opacity-50 rounded-full transform translate-x-24 translate-y-20"></div> */}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">Need Help? Open a Ticket</h1>
        <p className="text-gray-600 mt-2">
          Submit Your Support Ticket. We will be with you as soon as we are able.
        </p>
      </div>

      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl relative overflow-hidden">
        {/* Background Shape */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg opacity-30"></div>

        <form className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="first-name">
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="last-name">
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="email">
                Business Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="phone-number">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone-number"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your number"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="message">
              What are you looking for?
            </label>
            <textarea
              id="message"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Type your message here"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
