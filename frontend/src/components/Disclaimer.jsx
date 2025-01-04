import React from "react";

const Disclaimer = () => {
    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-4xl font-bold text-center text-black mb-8">
                    Disclaimer
                </h1>
                <p className="text-gray-700 mb-6 leading-7">
                    If you require any more information or have any questions about our
                    site's disclaimer, please feel free to contact us by email at{" "}
                    <a
                        href="mailto:mockperiod@gmail.com"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        Email@Website.com
                    </a>
                    .
                </p>

                {/* Section: General Disclaimer */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">
                        General Disclaimer
                    </h2>
                    <p className="text-gray-700 mb-6 leading-7">
                        All the information on this website is published in good faith and
                        for general information purposes only.{" "}
                        MockPeriod does not make any warranties about
                        the completeness, reliability, and accuracy of this information. Any
                        action you take upon the information you find on this website (
                            <a
                                href="https://mockperiod.com"
                                className="text-blue-500 underline hover:text-blue-700"
                            >
                                mockperiod.com
                            </a>
                        ) is strictly at your own risk. We will not be liable for any
                        losses and/or damages in connection with the use of our website.
                    </p>
                </div>

                {/* Section: External Links */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">
                        External Links
                    </h2>
                    <p className="text-gray-700 mb-6 leading-7">
                        From our website, you can visit other websites by following
                        hyperlinks to external sites. While we strive to provide only
                        quality links to useful and ethical websites, we have no control
                        over the content and nature of these sites. These links do not imply
                        a recommendation for all the content found on these sites. Site
                        owners and content may change without notice and may occur before we
                        have the opportunity to remove a link which may have gone ‘bad’.
                    </p>
                </div>

                {/* Section: Privacy Policies of External Sites */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">
                        Privacy Policies of External Sites
                    </h2>
                    <p className="text-gray-700 mb-6 leading-7">
                        Please be aware that when you leave our website, other sites may
                        have different privacy policies and terms which are beyond our
                        control. We recommend checking the privacy policies and "Terms of
                        Service" of these websites before engaging in any business or
                        uploading any information.
                    </p>
                </div>

                {/* Section: Consent */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">Consent</h2>
                    <p className="text-gray-700 mb-6 leading-7">
                        By using our website, you hereby consent to our disclaimer and agree
                        to its terms.
                    </p>
                </div>

                {/* Section: Updates */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">Update</h2>
                    <p className="text-gray-700 leading-7">
                        Should we update, amend, or make any changes to this document, those
                        changes will be prominently posted here.
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

export default Disclaimer;
