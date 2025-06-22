import React from 'react';
import Link from 'next/link';
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-100 via-white to-blue-100 py-10 shadow-inner rounded-t-xl">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-700">

        {/* Left - Copyright */}
        <div className="mb-6 md:mb-0 text-sm md:text-base font-medium">
          © {new Date().getFullYear()} <span className="text-blue-700 font-semibold">Vishal Raj</span> | All Rights Reserved
        </div>

        {/* Middle - Social Icons */}
        <div className="flex gap-5 mb-6 md:mb-0">
          {[
            {
              icon: <FaLinkedin size={24} />,
              href: "https://www.linkedin.com/in/vishal-raj-816485253/",
              label: "LinkedIn",
            },
            {
              icon: <FaGithub size={24} />,
              href: "https://github.com/VishalRaj20",
              label: "GitHub",
            },
            {
              icon: <FaTelegramPlane size={24} />,
              href: "https://t.me/vishal_raj20",
              label: "Telegram",
            },
            {
              icon: <FaInstagram size={24} />,
              href: "https://www.instagram.com/vishal_raj20",
              label: "Instagram",
            },
            {
              icon: <FaWhatsapp size={24} />,
              href: "https://wa.me/919142528179",
              label: "WhatsApp",
            },
          ].map(({ icon, href, label }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="bg-white shadow-md p-2 rounded-full hover:bg-blue-100 transition-all duration-300 hover:scale-110 text-blue-700"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Right - Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 text-md font-medium">
          <Link href="/" className="hover:text-blue-700 transition-colors duration-200">Home</Link>
          <Link href="/cars" className="hover:text-blue-700 transition-colors duration-200">Cars</Link>
          <Link href="/reservations" className="hover:text-blue-700 transition-colors duration-200">Reservations</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
