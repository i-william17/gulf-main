import React from 'react';
import backgroundImage from '../assets/3.jpg';
import TypingEffect from 'react-typing-effect';
import { useInView } from 'react-intersection-observer';
import Particles from 'react-tsparticles';
import { particlesConfig } from '../particle-config';
import img1 from "../assets/undraw_medicine_hqqg.svg";
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const { ref: headingRef, inView: isHeadingVisible } = useInView({ 
    triggerOnce: true,
    threshold: 0.2 
  });
  
  const { ref: paragraphRef, inView: isParagraphVisible } = useInView({ 
    triggerOnce: true,
    threshold: 0.2 
  });

  const { ref: imageRef, inView: isImageVisible } = useInView({ 
    triggerOnce: true,
    threshold: 0.2 
  });

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center text-white bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${backgroundImage})`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-600/20 animate-gradient" />
      
      {/* Particle Background */}
      <Particles params={particlesConfig} className="absolute inset-0" />

      {/* Main Content Container */}
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-6 lg:px-16 relative z-10">
        {/* Text Section */}
        <div className="flex flex-col items-start max-w-xl space-y-8 lg:mr-12">
          {/* Decorative Line */}
          <div 
            className={`w-24 h-1 bg-teal-500 transition-all duration-1000 ${
              isHeadingVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'
            }`}
          />
          
          {/* Heading */}
          <h3
            ref={headingRef}
            className={`text-4xl md:text-3xl lg:text-4xl font-extrabold tracking-wide transition-all duration-1000 ${
              isHeadingVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <TypingEffect
              text={['Welcome to Gulf Medical', 'Explore Services', 'Discover Opportunities']}
              speed={100}
              eraseSpeed={50}
              typingDelay={500}
              eraseDelay={2000}
            />
          </h3>

          {/* Description */}
          <p
            ref={paragraphRef}
            className={`text-lg md:text-xl text-gray-300 leading-relaxed transition-all duration-1000 delay-300 ${
              isParagraphVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            A cutting-edge health center combining state-of-the-art
            <br className="hidden md:block" />
            technology and innovative medical care for superior results.
          </p>

          {/* Call to Action Button */}
          <button
            className={`group bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full 
              font-semibold transition-all duration-300 transform hover:scale-105 
              hover:shadow-lg flex items-center gap-2 ${
                isParagraphVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
          >
            Learn More
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Image Section */}
        <div
          ref={imageRef}
          className={`mt-12 lg:mt-0 transition-all duration-1000 delay-500 ${
            isImageVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-20'
          }`}
        >
          <div className="relative">
            {/* Decorative Background Elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-300" />
            
            {/* Main Image */}
            <img
              src={img1}
              alt="Medical Illustration"
              className="relative w-full max-w-sm lg:max-w-md rounded-3xl shadow-2xl 
                transition-transform duration-500 hover:scale-105 hover:rotate-2"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-white/80 hover:text-white transition-colors duration-300" />
      </button>

      {/* Add custom keyframes for the gradient animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;