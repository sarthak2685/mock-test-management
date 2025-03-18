import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

const socialLinks = [
  {
    path: "https://www.instagram.com/mockperiod?igsh=MWRldDdnZHZ5aGdmcg==",
    icon: <AiFillInstagram />,
  },
  {
    path: "https://x.com/",
    icon: <FaXTwitter />,
  },
  {
    path: "https://www.facebook.com/profile.php?id=61571569440041&mibextid=ZbWKwL",
    icon: <FaFacebookF />,
  },
];

const reach = [
  {
    display: (
      <>
        <IoLocationSharp className="inline-block mr-2 hover:text-blue-500" />
        <span className="hover:text-blue-500">
          Civil Line Buxar, Bihar, India
        </span>
      </>
    ),
    path: "https://maps.app.goo.gl/crJqFFqsqCPKbAc76",
  },
  {
    display: (
      <>
        <IoCall className="inline-block mr-2" /> +91-9430995928,7004578419
      </>
    ),
    path: "tel:+919430995928 ", // Correct usage of 'tel:' link
  },
  {
    display: (
      <>
        <MdEmail className="inline-block mr-2" /> mockperiod@gmail.com
      </>
    ),
    path: "mailto:mockperiod@gmail.com", // Correct usage of 'mailto:' link
  },

];

const company = [
  {},
  { path: "/privacy-policy", display: "Privacy Policy" },
  { path: "/terms-condition", display: "Terms And Condition" },
];

// Footer component
const Footer = () => {
  return (
    <footer className="pt-10 bg-[#FCFCFC] text-black shadow-lg border-t-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-[30px]">
          {/* Logo Section */}
          <div className="text-center md:text-left">
            <h3 className="text-[28px] sm:text-[35px] font-[400] text-black mt-4">
              Mock
              <span className="text-[#007bff]">
                <b> Period.</b>
              </span>
            </h3>
            <p className="text-[14px] sm:text-[16px] font-[400] text-black mt-4">
              Elevate Your Exam Prep with Mock Period.
              <br />
              Ace Your Exams with Real-Time Practice.
              <br />
              Experience the real exam feel.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center md:justify-start gap-4">
            {socialLinks.map((link, index) => (
              <Link
                to={link.path}
                target={link.path.startsWith("http") ? "_blank" : "_self"}
                key={index}
                className="w-12 h-12 flex items-center justify-center group social-link hover:text-blue-500"
                aria-label={link.ariaLabel}
              >
                <div className="text-[24px] sm:text-[27px]">{link.icon}</div>
              </Link>
            ))}
          </div>

          {/* Reach Out To Us Section */}
          <div className="text-center md:text-left">
            <h2 className="text-[18px] sm:text-[20px] font-bold mb-3 text-black">
              Reach Out To Us
            </h2>
            <ul>
              <ul>
                {reach.map((item, index) => (
                  <li key={index} className="mb-4">
                    <a
                      href={item.path}
                      target={item.path.startsWith("http") ? "_blank" : "_self"} // Open in a new tab if it's an external link
                      rel="noopener noreferrer"
                      className="text-[14px] sm:text-[16px] leading-7 font-[400] text-black hover:text-blue-500"
                    >
                      {item.display}
                    </a>
                  </li>
                ))}
              </ul>

            </ul>
          </div>

          {/* Company Section */}
          <div className="text-center md:text-right">
            <h2 className="text-[18px] sm:text-[20px] font-bold mb-3 text-black">
              Company
            </h2>
            <ul>
              <a href="/Disclaimer" className="hover:text-blue-500">Disclaimer</a>
              {company.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    to={item.path}
                    className="text-[14px] sm:text-[16px] leading-7 font-[400] text-black hover:text-blue-500"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <br></br>
        <hr></hr>
        <div className="flex justify-between ">
          <a
            href="https://webcrafticx.com" // Replace with the actual URL
            target="_blank"
            rel="noopener noreferrer"
          >         
           <div className="md:text-left py-3 mt-auto items-center text-center justify-center">
              <p
                style={{ fontSize: "10px" }}
                className="text-gray-600 font-semibold"
              >
                Developed By
                <span className="font-semibold text-blue-500"> WebCrafticX</span>
              </p>
            </div>
          </a>
          {/* Copyright Section */}
          <div className="md:text-right py-3 mt-auto items-center text-center justify-center">
            <p
              style={{ fontSize: "10px" }}
              className="text-gray-600 font-semibold"
            >
              {" "}
              {/* Adjust ml-* for desired margin */}© Copyright{" "}
              {new Date().getFullYear()}{" "}
              <span className="font-semibold text-blue-500">MockPeriod</span> |
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
