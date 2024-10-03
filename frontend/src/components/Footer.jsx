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
  { path: "/why-us", display: "Why Us" },
  { path: "/privacy-policy", display: "Privacy Policy" },
  { path: "/terms-condition", display: "Terms And Condition" },
];

// Footer component
const Footer = () => {
  return (
    <footer className="pb-16 pt-10 bg-[#FCFCFC] text-black shadow-lg border-t-2 border-gray-200">
      <br />
      <br />
      <br />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px] text-left">
          <div className="-mt-6">
            {/* Logo Section */}
            <h3 className="text-[35px] font-[400] text-black mt-4">
              Mock <b>Period.</b>
            </h3>
            <p className="text-[16px] font-[400] text-black mt-4">
              Lorem ipsum is placeholder text commonly
              <br />
              used in the graphic, print, and publishing
              <br />
              industries for previewing layouts and visual
              <br />
              mockups.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            {socialLinks.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                className="w-12 h-12 flex items-center justify-center group social-link"
                aria-label={link.ariaLabel}
              >
                <div className="text-[27px]">{link.icon}</div>
              </Link>
            ))}
          </div>

          {/* Reach Out To Us */}
          <div>
            <h2 className="text-[20px] leading-[30px] font-[700] mb-3 text-black">
              Reach Out To Us
            </h2>
            <ul>
              {reach.map((item, index) => (
                <li key={index} className="mb-4 text-right">
                  <Link
                    to={item.path}
                    className="text-[16px] leading-7 font-[400] text-black"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-[20px] leading-[30px] font-[700] mb-3 text-black text-right">
              Company
            </h2>
            <ul>
              {company.map((item, index) => (
                <li key={index} className="mb-4 text-right">
                  <Link
                    to={item.path}
                    className="text-[16px] leading-7 font-[400] text-black"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
