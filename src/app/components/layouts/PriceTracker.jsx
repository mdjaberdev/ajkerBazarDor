"use client";

import { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { FaArrowUp, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import initialProducts from "../api/api";
import Header from "./Header";
import Container from "../common/Container";

const categories = [
  "সব", "শস্য", "সবজি", "মাছ", "মাংস", "ডাল", "তেল", "দুগ্ধ", "ফল", "মশলা", "টয়লেট্রিজ", "নাস্তা",
];

const PriceTracker = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // এডিটিং স্টেট
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", price: "", prevPrice: "" });

  // মাউন্ট হওয়ার সময় LocalStorage থেকে ডাটা লোড করা
  useEffect(() => {
    const savedProducts = localStorage.getItem("my_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // স্ক্রল পজিশন চেক
  useEffect(() => {
    const toggleVisibility = () => {
      window.scrollY > 300 ? setIsVisible(true) : setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 500, smooth: "easeInOutQuad" });
  };

  // এডিট শুরু
  const handleEditClick = (p) => {
    setEditingId(p.id);
    setEditFormData({ name: p.name, price: p.price, prevPrice: p.prevPrice });
  };

  // এডিট বন্ধ/ক্যানসেল
  const handleCancel = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  // ডাটা সেভ এবং LocalStorage আপডেট
  const handleSave = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...editFormData } : p
    );
    setProducts(updated);
    localStorage.setItem("my_products", JSON.stringify(updated));
    setEditingId(null);
  };

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === "সব" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                ${selectedCategory === cat ? "bg-green-600 text-white shadow-lg" : "bg-white border text-gray-600"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => {
              const isEditing = editingId === p.id;
              
              // দামের হিসাব (এডিট মুডে থাকলে ইনপুট ডাটা থেকে নেবে, নয়তো মেইন ডাটা থেকে)
              const currentPrice = isEditing ? Number(editFormData.price) : Number(p.price);
              const previousPrice = isEditing ? Number(editFormData.prevPrice) : Number(p.prevPrice);
              const priceDiff = Math.abs(currentPrice - previousPrice);
              const increased = currentPrice > previousPrice;
              const decreased = currentPrice < previousPrice;

              return (
                <div key={p.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative transition-all hover:shadow-md">
                  
                  {/* এডিট এবং ক্লোজ বাটন */}
                  <button 
                    type="button"
                    onClick={(e) => isEditing ? handleCancel(e) : handleEditClick(p)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${isEditing ? "bg-red-50 text-red-500" : "text-gray-300 hover:text-green-600"}`}
                  >
                    {isEditing ? <FaTimes size={16} /> : <FaEdit size={16} />}
                  </button>

                  <div>
                    <div className="text-5xl mb-4 transition-transform group-hover:scale-110">{p.icon}</div>
                    {isEditing ? (
                      <input 
                        className="font-bold text-lg border-b border-green-400 outline-none w-full mb-2 bg-transparent"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      />
                    ) : (
                      <h3 className="font-bold text-xl text-gray-800">{p.name}</h3>
                    )}
                    <p className="text-gray-400 text-sm mb-6 italic">{p.nameEn}</p>
                  </div>

                  <div className="border-t border-gray-50 pt-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <label className="text-[10px] text-gray-400 block mb-1">বর্তমান দাম</label>
                            <input 
                              type="number"
                              className="w-full border rounded p-1 text-sm focus:border-green-500 outline-none"
                              value={editFormData.price}
                              onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                            />
                          </div>
                          <div className="w-1/2">
                            <label className="text-[10px] text-gray-400 block mb-1">আগের দাম</label>
                            <input 
                              type="number"
                              className="w-full border rounded p-1 text-sm focus:border-green-500 outline-none"
                              value={editFormData.prevPrice}
                              onChange={(e) => setEditFormData({...editFormData, prevPrice: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        {/* এডিট মোডে থাকাকালীন প্রিভিউ */}
                        {priceDiff !== 0 && (
                          <div className={`text-[11px] font-bold text-center ${increased ? "text-red-500" : "text-green-600"}`}>
                            {increased ? `▲ ৳${priceDiff} বাড়বে` : `▼ ৳${priceDiff} কমবে`}
                          </div>
                        )}

                        <button 
                          onClick={() => handleSave(p.id)}
                          className="w-full bg-green-600 text-white py-1.5 rounded text-sm font-bold flex items-center justify-center gap-1 hover:bg-green-700 transition-colors"
                        >
                          <FaCheck size={12}/> সেভ করুন
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-green-700">৳{p.price}</span>
                            <span className="text-xs text-gray-500 font-medium">/{p.unit}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 italic">আগের: <span className="line-through decoration-red-300">৳{p.prevPrice}</span></p>
                        </div>

                        {/* দাম কমা বা বাড়ার ইন্ডিকেটর */}
                        {(increased || decreased) && (
                          <div className={`px-2 py-1 rounded-lg flex flex-col items-center justify-center min-w-[60px] ${increased ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                            <span className="text-[11px] font-bold leading-none">
                              {increased ? "▲" : "▼"} ৳{priceDiff}
                            </span>
                            <span className="text-[9px] uppercase font-black tracking-tight mt-0.5">
                              {increased ? "বেড়েছে" : "কমেছে"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {isVisible && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-2xl z-50 animate-bounce hover:scale-110 transition-transform">
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default PriceTracker;