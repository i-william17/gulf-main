import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Home,
  Building2,
  ChevronDown,
  ChevronRight,
  Building,
  Microscope,
  Stethoscope,
  Radio,
  Users,
  BadgeDollarSign
} from "lucide-react";
import img from "../assets/logo1-removebg-preview.png";

const TopBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="z-50 relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Animated border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 opacity-75" />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        <div className="py-4 px-6 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 group">
            <div className="relative overflow-hidden rounded-lg">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 opacity-20 group-hover:opacity-30 blur transition-opacity duration-300" />
              
              {/* Logo */}
              <div className="relative">
                <img
                  className="w-28 transform transition-transform duration-300 group-hover:scale-105"
                  alt="Logo"
                  src={img}
                />
              </div>
            </div>
          </div>

          {/* Departments Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              className="text-white flex items-center gap-2 hover:text-gray-200 relative group transition-all duration-300 focus:outline-none"
            >
              <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Departments</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-teal-600/95 backdrop-blur-sm text-white w-48 rounded-xl shadow-lg transition-all duration-300">
                <div className="py-2 space-y-1">
                  <Link to="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-teal-700/80 transition duration-300">
                    <Building className="w-4 h-4" />
                    <span>Front Office</span>
                  </Link>
                  <Link to="/accounts-login" className="flex items-center gap-2 px-4 py-2 hover:bg-teal-700/80 transition duration-300">
                    <BadgeDollarSign className="w-4 h-4" />
                    <span>Accounts</span>
                  </Link>
                  <Link to="/phlebotomy" className="flex items-center gap-2 px-4 py-2 hover:bg-teal-700/80 transition duration-300">
                    <Users className="w-4 h-4" />
                    <span>Phlebotomy</span>
                  </Link>
                  <Link to="/lab" className="flex items-center gap-2 px-4 py-2 hover:bg-teal-700/80 transition duration-300">
                    <Microscope className="w-4 h-4" />
                    <span>Laboratory</span>
                  </Link>
                  <Link to="/clinical" className="flex items-center gap-2 px-4 py-2 hover:bg-teal-700/80 transition duration-300">
                    <Stethoscope className="w-4 h-4" />
                    <span>Clinical</span>
                  </Link>
                  <Link to="/radiology" className="flex items-center gap-2 px-4 py-2 hover:bg-teal-700/80 transition duration-300">
                    <Radio className="w-4 h-4" />
                    <span>Radiology</span>
                  </Link>
                  <Link to="/agent" className="flex items-center gap-2 px-4 py-2 hover:bg-teal-700/80 transition duration-300 rounded-b-xl">
                    <Users className="w-4 h-4" />
                    <span>Agent</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Home Link */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700
              transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="relative">
              <Home className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
            </div>
            <span className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
              Home
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
