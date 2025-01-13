import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Terms and Conditions
        </h1>

        {/* Section: Application and Account Details */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Application and Account Details</h2>
          <p className="text-gray-700 mb-6 leading-7">
            By using this platform and creating an account, you are responsible for ensuring the
            confidentiality of your account credentials, including your username and password. It is
            also your responsibility to prevent unauthorized access to your computer or device. You
            agree to be accountable for all activities conducted through your account.
          </p>
          <p className="text-gray-700 mb-6 leading-7">
            If you are under 13 years of age, you may only use MockPeriod with the supervision and
            consent of a parent or legal guardian.
          </p>
          <p className="text-gray-700 leading-7">
            MockPeriod reserves the right to deny services to any individual or organization, terminate
            accounts, edit or remove content, or cancel orders at its sole discretion. The information
            you provide may be combined with data from third parties to enhance our services,
            personalize content, and optimize advertisements. This data-sharing process may involve
            reciprocal arrangements with other organizations.
          </p>
        </div>

        {/* Section: Mailing List */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Mailing List</h2>
          <p className="text-gray-700 mb-6 leading-7">
            Occasionally, we may share a portion of our customer database with trusted third-party
            companies to send you promotional offers or important information via mail, email, or phone.
            If you do not wish to share your information, no longer want to receive our catalog, or
            want to report duplicate communications, please contact us at
            <a
              href="mailto:mockperiod@gmail.com"
              className="text-blue-500 underline hover:text-blue-700"
            >
              mockperiod@gmail.com
            </a>.
          </p>
        </div>

        {/* Section: Delivery */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Delivery</h2>
          <p className="text-gray-700 leading-7">
            We do not offer physical product deliveries. All services and deliveries associated with
            payments are conducted online and processed in real time.
          </p>
        </div>

        {/* Section: Service Availability */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Service Availability</h2>
          <p className="text-gray-700 leading-7">
            We strive to provide uninterrupted service but cannot guarantee it. Downtime may occur
            due to maintenance, technical issues, or other reasons.
          </p>
        </div>

        {/* Section: Refund Policy */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Refund Policy</h2>
          <p className="text-gray-700 leading-7">We do not offer refunds.</p>
        </div>

        {/* Section: Monthly Subscription Plan */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Monthly Subscription Plan</h2>
          <p className="text-gray-700 leading-7">
            Enjoy the flexibility of our Monthly Subscription Plan tailored to suit your needs. It provides
            regular practice opportunities for various competitive exams.
          </p>
        </div>

        {/* Section: Disclaimer */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Disclaimer</h2>
          <p className="text-gray-700 mb-6 leading-7">
            THIS WEBSITE, THE APPLICATION, AND THE SERVICES ARE PROVIDED ON AN
            "AS IS" BASIS WITH ALL FAULTS AND WITHOUT ANY WARRANTY OF ANY KIND.
            THE COMPANY DISCLAIMS ALL WARRANTIES AND CONDITIONS, INCLUDING
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="text-gray-700 leading-7">
            Use of this website is entirely at your own risk. We are not responsible for ensuring
            services meet your specific requirements.
          </p>
        </div>

        {/* Section: Copyright */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Copyright</h2>
          <p className="text-gray-700 leading-7">
            All content on the MockPeriod.com platform, including text, graphics, and software, is owned
            by MockPeriod.com or its licensors and protected by Indian and international copyright laws.
            Unauthorized use of this content is strictly prohibited.
          </p>
        </div>

        {/* Section: Amendments */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Amendments</h2>
          <p className="text-gray-700 leading-7">
            MockPeriod.com may modify its platform, policies, and Conditions of Use at any time. If any
            condition is found invalid or unenforceable, it will be severed without affecting the validity
            of the remaining conditions. Users are encouraged to regularly check this page for updates.
          </p>
        </div>

        {/* Section: Limitation of Liability */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 leading-7">
            MockPeriod.com is not liable for any inaccuracies, damages, or technical issues caused by
            third parties. Users are encouraged to critically assess content before relying on it. The site
            is not responsible for verifying the accuracy of information shared by participants and advises
            users to independently verify content.
          </p>
        </div>

        {/* Section: Mock Test Questions */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Mock Test Questions</h2>
          <p className="text-gray-700 mb-6 leading-7">
            MockPeriod.com sources mock test questions from a mix of reference books and online
            platforms like Google. Questions are organized by topic, validated for accuracy, and updated
            regularly. If you think any question infringes on copyrights, please inform us, and we will
            address it promptly.
          </p>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            For any queries, contact us at
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
    </div>
  );
};

export default TermsAndConditions;
