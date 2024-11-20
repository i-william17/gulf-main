import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password) => {
    let strength = '';
    if (password.length >= 8) {
      strength = 'Strong';
    } else if (password.length >= 6) {
      strength = 'Medium';
    } else {
      strength = 'Weak';
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.terms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    // Prepare the data to send (excluding confirmPassword and terms)
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/user/register', dataToSend);
      toast.success('Registration successful');
      navigate('/login', { state: { fromSignup: true } });
    } catch (error) {
      const backendMessage = error.response?.data?.message || 'Error registering user';
      setError(backendMessage); // Show more specific backend error
      toast.error(backendMessage);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Create Account</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div
              className="absolute top-3 right-3 cursor-pointer text-gray-400"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Password Strength */}
          {formData.password && (
            <p className={`text-sm ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
              Password Strength: {passwordStrength}
            </p>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div
              className="absolute top-3 right-3 cursor-pointer text-gray-400"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <Link to="/terms" className="text-blue-500 hover:underline">Terms and Conditions</Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

      </div>
    </div>
  );
};

export default UserAccount;
