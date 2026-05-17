import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, TrendingUp, BookOpen, Clock } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../services/api";
import { FiqhRecord, CATEGORIES } from "../types";

export default function HomePage() {
  const [items, setItems] = useState<FiqhRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getAll();
      setItems(Array.isArray(data) ? data.slice(-5).reverse() : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold">Assalamu'alaikum</h2>
          <p className="text-emerald-50/80 text-sm">Cari solusi permasalahan fiqih harian Anda dengan mudah.</p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
          <BookOpen size={120} />
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <LayoutGrid size={18} className="text-emerald-600" />
            Kategori
          </h3>
          <Link to="/search" className="text-sm text-emerald-600 font-medium">Lihat Semua</Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link 
              key={cat} 
              to={`/category/${cat}`}
              className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <BookOpen size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Problems */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <Clock size={18} className="text-emerald-600" />
            Terbaru
          </h3>
        </div>
        
        <div className="space-y-3">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
               <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
             ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id}
              >
                <Link 
                  to={`/detail/${item.id}`}
                  className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase">
                      {item.kategori}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">
                    {item.pertanyaan}
                  </h4>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">Belum ada data.</div>
          )}
        </div>
      </section>
    </div>
  );
}
