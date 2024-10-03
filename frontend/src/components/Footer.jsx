import React from 'react';
import { Link } from 'react-router-dom';
/*import logo from '../../assets/images/logo.png';*/
import {  FaYoutube, FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";

const socialLinks = [
  {
    path: 'https://www.instagram.com/',
    icon: <AiFillInstagram />,
  },
  {
    path: 'https://x.com/',
    icon: <FaXTwitter />,
  },
  {
    path: 'https://www.youtube.com/c/',
    icon: <FaYoutube/>,
  },
];

const reach = [
  { display: 'Buxar,India' },
  { display: 'Call 9911334455' },
  { display: 'xcv@gmail.com' },
];

const company = [
   { path: '/about-us', display: 'About Us' },
   { path: '/privacy-policy', display: 'Privacy Policy' },
   { path: '/terms-condition', display: 'Terms And Condition' },
];

// Footer component
const Footer = () => {

  return (
    <footer className="pb-16 pt-10 bg-blue-600 text-white">
      <br></br>
      <br></br>
      <br></br>
      <div className="container">
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px] text-left">

          <div className="-mt-6">
            {/* Logo Section */}

            <h3 className="text-[35px] font-[400] text-white mt-4">Mock <b>Period.</b></h3>
            <p className="text-[16px] font-[400] text-white mt-4">
              Lorem ipsum is placeholder text commonly
              <br></br>
              used in the graphic, print, and publishing
              <br></br>
              industries for previewing layouts and visual
              <br></br>
              mockups.
            </p>
          </div>


          <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((link, index) => (
                <Link
                  to={link.path}
                  key={index}
                  className="w-9 h-9  flex items-center justify-center group  social-link"
                  aria-label={link.ariaLabel}
                >
                  {link.icon}
                </Link>
              ))}
            </div>


          {/*Reach Out To Us*/}
          <div>
            <h2 className="text-[20px] leading-[30px] font-[700] mb-3 text-white">
              Reach Out To Us
            </h2>
            <ul>
              {reach.map((item, index) => (
                <li key={index} className="mb-4 text-right">
                  <Link to={item.path} className="text-[16px] leading-7 font-[400] text-white ">
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>



          {/* Company */}
          <div>
            <h2 className="text-[20px] leading-[30px] font-[700] mb-3 text-white text-right">
              Company
            </h2>
            <ul>
              {company.map((item, index) => (
                <li key={index} className="mb-4 text-right">
                  <Link to={item.path} className="text-[16px] leading-7 font-[400] text-white ">
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
