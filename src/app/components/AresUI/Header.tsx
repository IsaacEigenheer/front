import { Zap } from "lucide-react";
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative px-8 py-16 text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Brascabos
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-blue-300 tracking-wider">
          ARES
        </h2>
        <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
          Automated Resource Extract System
        </p>
      </div>
    </div>
  );
};

export default Header;