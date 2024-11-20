import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo1-removebg-preview.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown menu state for departments
  const [navbarColor, setNavbarColor] = useState("bg-transparent"); // Initial color set to transparent
  const navigate = useNavigate();

  // Handle department selection and navigate to the login page with department info
  const handleDepartmentSelection = (department) => {
    setDropdownOpen(false); // Close the dropdown menu
    setIsOpen(false); // Close the mobile menu if it's open
    navigate('/login', { state: { department } }); // Navigate to the login page with department info
  };

  // Change navbar color on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarColor("bg-black shadow-md"); // Navbar becomes gray on scroll
      } else {
        setNavbarColor("bg-transparent"); // Navbar is transparent when at the top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${navbarColor} shadow-lg fixed w-full h-auto z-20 top-0 left-0 transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto px-16 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-3xl font-extrabold tracking-tight hover:animate-pulse">
          <Link to="/" className="hover:text-gray-300 transition duration-300">
            <img src={logo} alt='Logo' className="w-28" />
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex w-[60%] justify-center space-x-6 text-lg">
          <Link
            to="/about"
            className="text-white w-1/5 text-center hover:text-gray-200 relative group transition-all duration-300"
          >
            About Us
            <span className="absolute bottom-0 left-0 w-[0px] h-[3px] bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </Link>

          {/* Departments Dropdown */}
          <div className="relative w-1/5 text-center">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white w-full hover:text-gray-200 relative group transition-all duration-300 focus:outline-none"
            >
              Departments
              <span className="absolute bottom-0 left-0 w-[0px] h-[2px] bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
              <svg
                className={`w-4 h-4 inline-block ml-2 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 mt-2 bg-teal-500 text-white w-full rounded-lg shadow-lg transition-all duration-300 ${
                dropdownOpen ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              <Link to="/login" className="block w-full text-left px-4 py-2 hover:bg-teal-700 transition duration-300">Front Office</Link>
              <Link to="/accounts-login" className="block w-full text-left px-4 py-2 hover:bg-teal-700 transition duration-300">Accounts</Link>
              <Link to="/phlebotomy" className="block w-full text-left px-4 py-2 hover:bg-teal-700 transition duration-300">Phlebotomy</Link>
              <Link to="/lab" className="block w-full text-left px-4 py-2 hover:bg-teal-700 transition duration-300">Laboratory</Link>
              <Link to="/clinical" className="block w-full text-left px-4 py-2 hover:bg-teal-700 transition duration-300">Clinical</Link>
            </div>
          </div>

          <Link
            to="/contact"
            className="text-white w-1/6 text-center hover:text-gray-200 relative group transition-all duration-300"
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-[0px] h-[2px] bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </Link>
          <Link
            to="/admin"
            className="text-white w-1/6 text-center hover:text-gray-200 relative group transition-all duration-300"
          >
            Admin
            <span className="absolute bottom-0 left-0 w-[0px] h-[2px] bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none hover:scale-110 transform transition duration-300"
            aria-label="Menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Full Screen Overlay) */}
      <div
        className={`fixed inset-0 bg-teal-600 bg-opacity-95 z-30 transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-between h-full">
          <button
            className="text-white text-3xl hover:text-gray-300 p-4 focus:outline-none"
            onClick={() => setIsOpen(false)} // Close the mobile menu
            aria-label="Close Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center space-y-8">
            <Link
              to="/about"
              className="text-white text-2xl hover:bg-teal-700 px-6 py-3 rounded-lg transition duration-300 hover:shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>

            {/* Dropdown Menu for Departments */}
            <div className="relative w-full px-6">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white text-2xl w-full hover:bg-teal-700 py-3 rounded-lg transition duration-300 flex justify-between items-center"
              >
                Departments
                <svg
                  className={`w-6 h-6 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu Items */}
              <div
                className={`mt-3 w-full rounded-lg shadow-lg bg-teal-500 transition-all duration-300 ${
                  dropdownOpen ? "block opacity-100" : "hidden opacity-0"
                }`}
              >
                <Link to="/login" className="block text-white text-lg px-4 py-2 hover:bg-teal-700 transition duration-300">Front Office</Link>
                <Link to="/accounts-login" className="block text-white text-lg px-4 py-2 hover:bg-teal-700 transition duration-300">Accounts</Link>
                <Link to="/phlebotomy" className="block text-white text-lg px-4 py-2 hover:bg-teal-700 transition duration-300">Phlebotomy</Link>
                <Link to="/lab" className="block text-white text-lg px-4 py-2 hover:bg-teal-700 transition duration-300">Laboratory</Link>
                <Link to="/clinical" className="block text-white text-lg px-4 py-2 hover:bg-teal-700 transition duration-300">Clinical</Link>
              </div>
            </div>

            <Link
              to="/contact"
              className="text-white text-2xl hover:bg-teal-700 px-6 py-3 rounded-lg transition duration-300 hover:shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/admin"
              className="text-white text-2xl hover:bg-teal-700 px-6 py-3 rounded-lg transition duration-300 hover:shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
