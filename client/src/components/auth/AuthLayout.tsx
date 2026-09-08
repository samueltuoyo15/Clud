import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      {/* Left Pane - Large Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#F9FAFC] border-r border-neutral-200/80 flex-col items-center justify-center p-12 overflow-hidden select-none">
        {/* Ambient subtle brand glows */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#3902FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#006FEE]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center">
          <img
            src="/images/auth-illustration.svg"
            alt="Clud Teamwork"
            className="w-full max-w-lg h-auto max-h-[520px] object-contain drop-shadow-xs transition-transform duration-300 hover:scale-[1.01]"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith(".svg")) {
                target.src = "/images/auth-illustration.png";
              }
            }}
          />
          <div className="mt-6 max-w-md">
            <h2 className="text-xl font-heading font-bold text-neutral-900 tracking-tight">
              Keep your team in sync
            </h2>
            <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
              Detect API drift automatically, track schema breaking changes, and protect your team from silent outages.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 pt-28 pb-12 relative z-10 bg-white min-h-screen overflow-y-auto">
        {/* Absolute Logo Top Left */}
        <div className="absolute top-8 left-0 right-0 px-8 sm:px-16 lg:px-24">
          <div className="max-w-md mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/favicon.svg" 
                alt="Clud Logo" 
                className="w-10 h-10"
              />
              <span className="font-heading font-bold text-lg text-neutral-900 hidden sm:block">Clud</span>
            </Link>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
