/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { Search, Briefcase, MapPin, SearchX, ExternalLink, ArrowUp } from "lucide-react";
import rawData from "./data.json";
import { Company } from "./types";
import { motion, AnimatePresence } from "motion/react";

const companies: Company[] = rawData as Company[];

const categories = [
  { label: 'All', keywords: [] },
  { label: 'Customer Service', keywords: ['customer', 'support', 'call', 'helpdesk', 'care'] },
  { label: 'Tech & AI', keywords: ['tech', 'ai ', 'artificial intelligence', 'engineer', 'software'] },
  { label: 'Sales', keywords: ['sales', 'retention', 'sell'] },
  { label: 'Data Entry', keywords: ['data entry', 'typing', 'data'] },
  { label: 'Transcription', keywords: ['transcri', 'caption', 'subtitl', 'translat', 'interpret'] },
  { label: 'Healthcare', keywords: ['health', 'medical', 'pharmacy', 'nurse', 'medication'] },
  { label: 'Education', keywords: ['tutor', 'education', 'teach', 'student'] },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredCompanies = useMemo(() => {
    let result = companies;
    
    if (selectedCategory !== "All") {
      const category = categories.find(c => c.label === selectedCategory);
      if (category) {
        result = result.filter(company => {
          const text = (company.name + " " + company.description).toLowerCase();
          return category.keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
      }
    }

    const term = searchTerm.toLowerCase();
    if (term) {
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(term) ||
          company.description.toLowerCase().includes(term),
      );
    }
    
    return result;
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:h-16 flex items-center w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold tracking-tight uppercase">
                  Remote Work Directory
                </h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                  Explore {companies.length} Verified Jobs
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded text-sm leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Search companies or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6 flex flex-col">
        <div className="flex justify-between items-end mb-2">
          <div className="space-y-1">
            <nav className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace / Directory</nav>
            <h2 className="text-3xl font-light text-slate-900 tracking-tight">Available <span className="font-bold">Opportunities</span></h2>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button
              key={category.label}
              onClick={() => setSelectedCategory(category.label)}
              className={`whitespace-nowrap px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${
                selectedCategory === category.label
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 tracking-tight mb-1">
              No matches found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              We couldn't find any companies matching "{searchTerm}". Try
              adjusting your search terms.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition-colors"
            >
              CLEAR SEARCH
            </button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            <AnimatePresence>
              {filteredCompanies.map((company, index) => (
                <motion.a
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    duration: 0.2,
                  }}
                  key={company.id}
                  href={`https://www.google.com/search?q=${encodeURIComponent(company.name + ' remote jobs careers')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col group hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      ID: {String(company.id).padStart(3, '0')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Search Role <ExternalLink className="w-3 h-3" />
                      </span>
                      <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors"></div>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-800 group-hover:bg-blue-600 transition-colors rounded flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                      {company.name}
                    </h2>
                  </div>
                  <p className="relative z-10 text-xs text-slate-600 leading-relaxed flex-grow">
                    {company.description}
                  </p>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 bg-white text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          DIRECTORY ONLINE
        </p>
      </footer>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-slate-800 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
