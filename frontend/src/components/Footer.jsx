import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id='next-section' className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-12">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Footer Logo and Description */}
        <div>
          <div className="text-4xl font-extrabold mb-4">
            <Link to="/" className="hover:text-gray-200 transition duration-300">
              Gulf Health Centre Limited
            </Link>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Exceptional care with a focus on compassion and innovation. Our team is committed to enhancing your health and well-being with the highest standards.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition duration-300 transform hover:scale-110"
            >
              <FaFacebook size={28} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition duration-300 transform hover:scale-110"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition duration-300 transform hover:scale-110"
            >
              <FaLinkedin size={28} />
            </a>
            {/* Custom X Icon for Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition duration-300 transform hover:scale-110"
              aria-label="X"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
                <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.949.565-2.001.974-3.127 1.195-.896-.956-2.173-1.555-3.591-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .386.044.761.127 1.124-4.087-.205-7.713-2.162-10.141-5.144-.423.724-.666 1.565-.666 2.465 0 1.7.866 3.197 2.181 4.078-.803-.025-1.558-.247-2.213-.616v.062c0 2.374 1.688 4.358 3.93 4.809-.412.112-.846.172-1.294.172-.315 0-.622-.03-.923-.086.623 1.951 2.428 3.374 4.567 3.415-1.674 1.311-3.787 2.096-6.086 2.096-.395 0-.785-.023-1.17-.067 2.168 1.392 4.737 2.207 7.508 2.207 9.013 0 13.94-7.466 13.94-13.944 0-.213-.005-.425-.014-.637.96-.694 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 border-b border-gray-500 pb-2">Quick Links</h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/about"
                className="hover:text-gray-200 transition duration-300 transform hover:translate-x-2"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-gray-200 transition duration-300 transform hover:translate-x-2"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/departments"
                className="hover:text-gray-200 transition duration-300 transform hover:translate-x-2"
              >
                Departments
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-gray-200 transition duration-300 transform hover:translate-x-2"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 border-b border-gray-500 pb-2">Contact Us</h3>
          <p className="text-gray-300 mb-4">
            <span className="font-semibold">Address:</span> Rozina House, Moi Avenue - Opposite Uhuru Gardens <br/>
            P.O. BOX 6648-00100 GPO Nairobi
          </p>
          <p className="text-gray-300 mb-4">
            <span className="font-semibold">Phone:</span> (+254) 78-567-901
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Email:</span> gulfhealthcarekenya@gmail.com
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-teal-900 text-center py-6 mt-12 border-t border-teal-700 shadow-md">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Gulf Medical Health Centre. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
