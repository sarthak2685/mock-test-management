import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Terms and Conditions
        </h1>
        <p className="text-gray-700 mb-6 leading-7">
          Welcome to <strong>MockPeriod!</strong>
        </p>
        <p className="text-gray-700 mb-6 leading-7">
          These terms and conditions outline the rules and regulations for the
          use of MockPeriod, located at{" "}
          <a
            href="https://mockperiod.com"
            className="text-blue-500 underline hover:text-blue-700"
          >
            mockperiod.com
          </a>
          .
        </p>
        <p className="text-gray-700 mb-6 leading-7">
          By accessing this website, we assume you accept these terms and
          conditions. Do not continue to use MockPeriod if you
          do not agree to all the terms and conditions stated on this page.
        </p>

        {/* Section: Cookies */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Cookies</h2>
          <p className="text-gray-700 mb-6 leading-7">
            We employ the use of cookies. By accessing{" "}
            MockPeriod, you agreed to use cookies in agreement
            with our{" "}
            <a
              href="/privacy-policy"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">License</h2>
          <p className="text-gray-700 mb-6 leading-7">
            Unless otherwise stated, MockPeriod and/or its
            licensors own the intellectual property rights for all material on{" "}
            MockPeriod. All intellectual property rights are
            reserved.
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-7">
            <li>You must not republish material from MockPeriod.</li>
            <li>You must not sell, rent, or sub-license material from MockPeriod.</li>
            <li>You must not reproduce, duplicate, or copy material from MockPeriod.</li>
            <li>You must not redistribute content from MockPeriod.</li>
          </ul>
        </div>

        {/* Section: User Comments */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">
            User Comments
          </h2>
          <p className="text-gray-700 mb-6 leading-7">
            Certain areas of this website allow users to post and exchange
            opinions and information. MockPeriod does not
            filter, edit, publish, or review Comments prior to their appearance
            on the website.
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-7">
            <li>Your Comments must not infringe intellectual property rights.</li>
            <li>Your Comments must not contain offensive material.</li>
            <li>Your Comments must not solicit business or promote unlawful activities.</li>
          </ul>
        </div>

        {/* Section: Hyperlinking */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Hyperlinking to Our Content
          </h2>
          <p className="text-gray-700 mb-6 leading-7">
            Organizations such as government agencies, search engines, and news
            organizations may link to our website without prior approval. Links
            must not be deceptive, falsely imply sponsorship, or appear in
            inappropriate contexts.
          </p>
        </div>

        {/* Section: Disclaimer */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Disclaimer
          </h2>
          <p className="text-gray-700 mb-6 leading-7">
            To the maximum extent permitted by law, we exclude all
            representations, warranties, and conditions relating to our website
            and the use of this website.
          </p>
          <p className="text-gray-700 leading-7">
            As long as the website is free of charge, we will not be liable for
            any loss or damage of any nature.
          </p>
        </div>
      </div>
      <footer className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            For any queries, contact us at{" "}
            <a
              href="mailto:mockperiod@gmail.com"
              className="text-blue-600 hover:underline"
            >
              mockperiod@gmail.com
            </a>
            .
          </p>
        </footer>
    </div>
  );
};

export default TermsAndConditions;
