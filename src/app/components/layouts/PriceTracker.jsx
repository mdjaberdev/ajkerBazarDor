"use client";

import { useState, useEffect } from "react";

import { Link, animateScroll as scroll } from "react-scroll"; // ১. react-scroll ইমপোর্ট

import { FaArrowUp } from "react-icons/fa";

import initialProducts from "../api/api";

import Header from "./Header";

import Container from "../common/Container";

const categories = [
  "সব",

  "শস্য",

  "সবজি",

  "মাছ",

  "মাংস",

  "ডাল",

  "তেল",

  "দুগ্ধ",

  "ফল",

  "মশলা",

  "টয়লেট্রিজ",

  "নাস্তা",
];

const PriceTracker = () => {
  const [products] = useState(initialProducts);

  const [selectedCategory, setSelectedCategory] = useState("সব");

  const [searchQuery, setSearchQuery] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  // স্ক্রল পজিশন চেক করা

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // ৩. react-scroll ব্যবহার করে উপরে যাওয়ার ফাংশন

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500,

      smooth: "easeInOutQuad",
    });
  };

  useEffect(() => {
    const handleFilter = (e) => {
      setSelectedCategory(e.detail);
    };

    window.addEventListener("filterCategory", handleFilter);

    return () => window.removeEventListener("filterCategory", handleFilter);
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "সব" || p.category === selectedCategory;

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white relative">
      <Container>
        <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-4 md:p-10">
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="flex gap-2 mb-10 flex-wrap justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200

                ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => {
                const currentPrice = Number(p.price);

                const previousPrice = Number(p.prevPrice);

                const increased = currentPrice > previousPrice;

                const priceDifference = Math.abs(currentPrice - previousPrice);

                return (
                  <div
                    key={p.id}
                    className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {p.icon}
                      </div>

                      <h3 className="font-bold text-xl text-gray-800 leading-tight">
                        {p.name}
                      </h3>

                      <p className="text-gray-400 text-sm mb-6 italic">
                        {p.nameEn}
                      </p>
                    </div>

                    <div className="flex items-end justify-between border-t border-gray-50 pt-4">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-green-700">
                            ৳{p.price}
                          </span>

                          <span className="text-xs text-gray-500 font-medium">
                            /{p.unit}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400 mt-1">
                          আগের দাম:{" "}
                          <span className="line-through">৳{p.prevPrice}</span>
                        </p>
                      </div>

                      {currentPrice !== previousPrice && (
                        <div
                          className={`px-3 py-1 rounded-lg flex flex-col items-center justify-center ${increased ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                        >
                          <span className="text-xs font-bold leading-none">
                            {increased ? "▲" : "▼"} ৳{priceDifference}
                          </span>

                          <span className="text-[9px] uppercase font-black tracking-tighter mt-1">
                            {increased ? "বেড়েছে" : "কমেছে"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <div className="text-6xl mb-4">🔍</div>

              <p className="text-gray-500 text-xl font-medium">
                দুঃখিত, "{searchQuery}" নামে কোনো পণ্য পাওয়া যায়নি।
              </p>

              <button
                onClick={() => {
                  setSearchQuery("");

                  setSelectedCategory("সব");
                }}
                className="mt-4 text-green-600 font-bold hover:underline"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          )}
        </div>
      </Container>

      {/* ৪. react-scroll এবং react-icons বাটন */}

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all duration-300 z-50 animate-bounce group"
        >
          <FaArrowUp className="text-xl group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default PriceTracker;
