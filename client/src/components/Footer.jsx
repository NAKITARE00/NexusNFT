import React from 'react';
import { nexuslogo } from '../assets';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#1c1d21] to-[#2c2d31] text-white py-8">
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src={nexuslogo} 
              alt="Nexus Logo" 
              className="w-[80px] h-[40px] object-contain cursor-pointer 
                         hover:scale-110 transition-all duration-300 ease-in-out mr-4"
            />
            <h2 className="text-xl font-bold font-epilogue">Nexus</h2>
          </div>
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:text-[#4acd8d] transition-colors duration-300">Home</a></li>
              <li><a href="#" className="hover:text-[#4acd8d] transition-colors duration-300">About</a></li>
              <li><a href="#" className="hover:text-[#4acd8d] transition-colors duration-300">Services</a></li>
              <li><a href="#" className="hover:text-[#4acd8d] transition-colors duration-300">Contact</a></li>
            </ul>
          </nav>
          <div className="text-sm font-epilogue">
            © {new Date().getFullYear()} Nexus. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;