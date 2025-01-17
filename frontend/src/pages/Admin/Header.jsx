import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo1-removebg-preview.png';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between bg-gradient-to-r from-gray-900 to-black px-6 py-4 shadow-lg text-white z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img 
          src={logo}
          alt="Logo"
          className="ml-16 h-20 w-28"
        />
      </div>

      {/* Icons Section */}
      <div className="flex items-center space-x-8">
        {/* User Avatar */}
        <div className="relative group">
          <div onClick={toggleDropdown} className="flex items-center cursor-pointer space-x-2 group">
            <FaUserCircle className="text-2xl hover:text-blue-400 transition-transform transform hover:scale-110" />
            <p className="hidden md:block">Admin</p>
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-20 animate-fadeIn">
              <button className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">Profile</button>
              <button className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">Account Settings</button>
              <button className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100">Help</button>
              <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>

        {/* Logout Icon */}
        <div className="relative group">
          <Link to="/">
          <FaSignOutAlt className="text-2xl cursor-pointer hover:text-red-400 transition-transform transform group-hover:scale-110" />
          <span className="absolute -top-8 left-2 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Logout
          </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
