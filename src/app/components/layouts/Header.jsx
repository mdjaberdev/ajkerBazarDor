"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Header = ({ searchQuery, setSearchQuery, totalProducts = 80 }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // বাংলা তারিখ এবং সময় সেট করা
    const updateTime = () => {
      const now = new Date();
      const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      
      setCurrentDate(now.toLocaleDateString('bn-BD', dateOptions));
      setCurrentTime(now.toLocaleTimeString('bn-BD', timeOptions));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative mb-12">
      {/* Background Decor */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
      
      <div className="flex flex-col gap-8">
        
        {/* Top Section: Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-gray-600 uppercase tracking-widest bg-green-50 px-3 py-0.5 rounded-full">
                সরাসরি বাজার আপডেট
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
               আজকের বাজার  দর
            </h1>
            
            <p className="text-slate-500 font-medium flex items-center gap-2">
              📅 {currentDate} <span className="text-slate-300">|</span> 🕒 {currentTime}
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="flex gap-4">
            <div className="bg-white shadow-sm border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-amber-100 p-3 rounded-xl text-2xl">📦</div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">মোট পণ্য</p>
                <p className="text-xl font-black text-slate-800">{totalProducts} টি</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Search & Welcome */}
        <div className="relative group">
          {/* Search bar with floating effect */}
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl group-focus-within:animate-bounce">🔍</span>
              </div>
              <input
                type="text"
                placeholder="আজকে কি কিনতে চান? যেমন: 'চাল' বা 'পেঁয়াজ'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 bg-white border-2 border-slate-100 focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none pl-14 pr-6 rounded-2xl text-lg font-medium text-slate-700 shadow-sm transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-red-500 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-center px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all cursor-default shadow-lg shadow-slate-200">
               ঢাকা শহর
            </div>
          </div>
        </div>

        {/* Message Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-500">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 font-medium">
                দ্রষ্টব্য: এলাকাভেদে খুচরা বাজারে ৫-১০ টাকা দামের পার্থক্য হতে পারে।
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;