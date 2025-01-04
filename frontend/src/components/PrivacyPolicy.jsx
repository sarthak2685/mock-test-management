import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-600 mt-4">
            Protecting your data is our priority. This policy outlines how we
            collect, use, and safeguard your information.
          </p>
        </header>

        {/* Content */}
        <section className="space-y-10">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Privacy of Users Below 13 Years of Age
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This website is not intended for users under the age of 13, and we
              do not knowingly collect data from them. If we discover such data,
              it will be deleted immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Information Sharing Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or share your personal information with
              third parties. However, anonymized performance data (e.g., test
              scores) may be displayed if you rank among top performers in a
              category.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              To maintain your account's security, keep your credentials
              (username, email, and password) private. If you suspect
              unauthorized access, contact us immediately at{" "}
              <a
                href="mailto:mockperiod@gmail.com"
                className="text-blue-600 hover:underline"
              >
                mockperiod@gmail.com
              </a>
              .
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Information We Collect
            </h2>
            <ul className="text-gray-700 leading-relaxed list-disc pl-5">
              <li>
                **Account Information:** Your name, email, phone number, and
                location during registration.
              </li>
              <li>
                **Performance Data:** Your scores, time spent on tests, and test
                history.
              </li>
              <li>
                **Technical Data:** Browser type, IP address, and website usage
                patterns.
              </li>
              <li>
                **Payment Information:** Collected securely via our payment
                partner for paid features (we do not store payment details).
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. How We Use Your Information
            </h2>
            <ol className="text-gray-700 leading-relaxed list-decimal pl-5">
              <li>
                **Enhance User Experience:** Personalize content based on your
                preferences and test performance.
              </li>
              <li>
                **Improve Services:** Use feedback and analytics to refine our
                mock test features.
              </li>
              <li>
                **Send Notifications:** Provide updates, reminders for upcoming
                tests, or performance insights.
              </li>
              <li>
                **Security Measures:** Prevent fraudulent activities and
                unauthorized access.
              </li>
            </ol>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Use of Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies enhance your experience by remembering preferences and
              providing relevant content. You can manage cookie settings in your
              browser. Disabling cookies may limit certain features on the
              website.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Test Results and Leaderboards
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your test performance may be anonymously displayed on leaderboards
              or achievement sections. You can opt-out of leaderboard
              participation by adjusting your privacy settings in your account.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Account Deletion
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You can request account deletion by contacting us at{" "}
              <a
                href="mailto:mockperiod@gmail.com"
                className="text-blue-600 hover:underline"
              >
                mockperiod@gmail.com
              </a>
              . Once deleted, your data will be removed from our systems within
              30 days.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            For any privacy-related concerns, contact us at{" "}
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

export default PrivacyPolicy;
