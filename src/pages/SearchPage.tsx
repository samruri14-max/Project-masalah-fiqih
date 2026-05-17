import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, X, Filter, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../services/api";
import { FiqhRecord, CATEGORIES } from "../types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FiqhRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string>("Semua");

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim() && selectedCat === "Semua") {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      let data = await api.search(q);
      if (selectedCat !== "Semua") {
        data = data.filter(i => i.kategori === selectedCat);
      }
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCat]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-16 z-30 pt-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg">
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari masalah fiqih..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          {["Semua", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))
        ) : results.length > 0 ? (
          <AnimatePresence>
            {results.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/detail/${item.id}`}
                  className="block p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-900 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase">
                      {item.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400">ID: {item.id}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                    {item.pertanyaan}
                  </h4>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.jawaban}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <SearchIcon size={48} strokeWidth={1} />
            <p className="text-sm">Mulai mencari atau pilih kategori</p>
          </div>
        )}
      </div>
    </div>
  );
}
