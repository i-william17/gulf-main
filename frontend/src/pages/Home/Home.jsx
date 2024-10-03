import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { DNA } from 'react-loader-spinner';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS for scroll animations
    AOS.init({ duration: 1000 });

    // Simulate a loading delay, e.g., 5 seconds
    const timer = setTimeout(() => setLoading(false), 5000);

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  // Display loader while loading state is true
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black to-black">
        <DNA
          height="120"
          width="120"
          color="#ffffff"
          ariaLabel="dna-loading"
          visible={true}
        />
      </div>
    );
  }

  // Once loading is complete, render the page content
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar data-aos="fade-down" />

      <Hero data-aos="zoom-in"/>
        

      <Footer />
       
    </div>
  );
};

export default Home;
