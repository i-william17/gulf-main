import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Activity, Calendar, Users, FileText, Settings } from 'lucide-react';

const LeftBar = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent animate-pulse" />
      
      {/* Glass morphism effect container */}
      <div className="relative z-10 backdrop-blur-sm bg-white/5">
        {/* Header Section */}
        <div className="py-8 px-6">
          <div className="flex items-center gap-3 group">
            <Building2 className="w-8 h-8 text-teal-300 group-hover:text-teal-200 transition-colors duration-300" />
            <h3 className="text-2xl font-bold tracking-tight relative">
              Gulf Medical
              <span className="block text-sm font-medium text-teal-300 mt-1">
                Health Centre
              </span>
              <div className="absolute -bottom-4 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-transparent group-hover:w-full transition-all duration-500" />
            </h3>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-teal-900/50 to-transparent" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-teal-400/10 blur-3xl animate-pulse"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/50 via-teal-300/50 to-teal-500/50" />
    </div>
  );
};

export default LeftBar;