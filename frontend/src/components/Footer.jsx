import React from "react";
import { Link } from "react-router-dom";
import { FaYoutube, FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

const socialLinks = [
  {
    path: "https://www.instagram.com/",
    icon: <AiFillInstagram />,
  },
  {
    path: "https://x.com/",
    icon: <FaXTwitter />,
  },
  {
    path: "https://www.youtube.com/c/",
    icon: <FaYoutube />,
  },
];

const reach = [
  {
    display: (
      <>
        <IoLocationSharp className="inline-block mr-2" /> Buxar, India
      </>
    ),
  },
  {
    display: (
      <>
        <IoCall className="inline-block mr-2" /> +91-9911334455
      </>
    ),
  },
  {
    display: (
      <>
        <MdEmail className="inline-block mr-2" /> xcv@gmail.com
      </>
    ),
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
                key={index}
                className="w-12 h-12 flex items-center justify-center group social-link"
                aria-label={link.ariaLabel}
              >
                <div className="text-[24px] sm:text-[27px]">{link.icon}</div>
              </Link>
            ))}
          </div>

          {/* Reach Out To Us Section */}
          <div className="text-center md:text-right">
            <h2 className="text-[18px] sm:text-[20px] font-bold mb-3 text-black">
              Reach Out To Us
            </h2>
            <ul>
              {reach.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    to={item.path}
                    className="text-[14px] sm:text-[16px] leading-7 font-[400] text-black"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="text-center md:text-right">
            <h2 className="text-[18px] sm:text-[20px] font-bold mb-3 text-black">
              Company
            </h2>
            <ul>
              <a href="#why-us">Why Us</a>
              {company.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    to={item.path}
                    className="text-[14px] sm:text-[16px] leading-7 font-[400] text-black"
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

        {/* Copyright Section */}
        <div className="md:text-right py-3 mt-auto items-center text-center justify-center">
          <p
            style={{ fontSize: "10px" }}
            className="text-gray-600 font-semibold"
          >
            {" "}
            {/* Adjust ml-* for desired margin */}© Copyright{" "}
            {new Date().getFullYear()}{" "}
            <span className="font-semibold text-blue-500">WebCraftrix</span> |
            All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
