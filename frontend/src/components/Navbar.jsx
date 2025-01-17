import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home,
  Info,
  Phone,
  Building2,
  ChevronDown,
  Menu,
  X,
  UserCog,
  Building,
  Microscope,
  Stethoscope,
  Radio,
  Users,
  BadgeDollarSign
} from "lucide-react";
import logo from '../assets/logo1-removebg-preview.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarColor, setNavbarColor] = useState("bg-transparent");
  const navigate = useNavigate();

  const handleDepartmentSelection = (department) => {
    setDropdownOpen(false);
    setIsOpen(false);
    navigate('/login', { state: { department } });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarColor("bg-black/90 backdrop-blur-sm");
      } else {
        setNavbarColor("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${navbarColor} fixed w-full h-auto z-20 top-0 left-0 transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto px-4 lg:px-16 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-3xl font-extrabold tracking-tight group">
          <Link to="/" className="flex items-center gap-2 hover:text-gray-300 transition duration-300">
            <Home className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            <img src={logo} alt='Logo' className="w-28" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-[60%] justify-center space-x-8 text-lg">
          <Link
            to="/about"
            className="text-white flex items-center gap-2 hover:text-gray-200 relative group transition-all duration-300"
          >
            <Info className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>About Us</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </Link>

          {/* Departments Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white flex items-center gap-2 hover:text-gray-200 relative group transition-all duration-300 focus:outline-none"
            >
              <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Departments</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 mt-2 bg-teal-600/95 backdrop-blur-sm text-white w-48 rounded-xl shadow-lg transition-all duration-300 ${
                dropdownOpen ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-2"
              }`}
            >
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
          </div>

          <Link
            to="/contact"
            className="text-white flex items-center gap-2 hover:text-gray-200 relative group transition-all duration-300"
          >
            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Contact Us</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </Link>

          <Link
            to="/admin"
            className="text-white flex items-center gap-2 hover:text-gray-200 relative group transition-all duration-300"
          >
            <UserCog className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Admin</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none hover:scale-110 transform transition duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-teal-600/95 backdrop-blur-sm z-30 transition-all duration-500 ${
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-start h-full pt-8 space-y-8">
          <button
            className="text-white hover:text-gray-300 p-4 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col items-center space-y-6 w-full px-8">
            <Link
              to="/about"
              className="text-white text-xl flex items-center gap-3 hover:bg-teal-700/80 px-6 py-3 rounded-xl w-full justify-center transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Info className="w-6 h-6" />
              <span>About Us</span>
            </Link>

            <div className="w-full">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white text-xl flex items-center gap-3 hover:bg-teal-700/80 px-6 py-3 rounded-xl w-full justify-center transition duration-300"
              >
                <Building2 className="w-6 h-6" />
                <span>Departments</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <div
                className={`mt-2 w-full rounded-xl bg-teal-700/50 transition-all duration-300 ${
                  dropdownOpen ? "block opacity-100" : "hidden opacity-0"
                }`}
              >
                {/* Mobile Dropdown Items */}
                <div className="py-2 space-y-1">
                  <Link to="/login" className="flex items-center gap-3 px-6 py-3 hover:bg-teal-700/80 transition duration-300">
                    <Building className="w-5 h-5" />
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
            </div>

            <Link
              to="/contact"
              className="text-white text-xl flex items-center gap-3 hover:bg-teal-700/80 px-6 py-3 rounded-xl w-full justify-center transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="w-6 h-6" />
              <span>Contact Us</span>
            </Link>

            <Link
              to="/admin"
              className="text-white text-xl flex items-center gap-3 hover:bg-teal-700/80 px-6 py-3 rounded-xl w-full justify-center transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              <UserCog className="w-6 h-6" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;