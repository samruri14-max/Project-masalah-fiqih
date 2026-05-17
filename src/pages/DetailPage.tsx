import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Bookmark, Copy, Check, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../services/api";
import { FiqhRecord } from "../types";
import { useBookmarks } from "../hooks/useBookmarks";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<FiqhRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toggleBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (id: string) => {
    try {
      const data = await api.getById(id);
      setItem(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!item) return;
    const text = `Pertanyaan: ${item.pertanyaan}\n\nJawaban: ${item.jawaban}\n\nIbarat: ${item.ibarot}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!item) return;
    try {
      await navigator.share({
        title: "Masalah Fiqih: " + item.pertanyaan,
        text: item.pertanyaan + "\n\n" + item.jawaban,
        url: window.location.href,
      });
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    </div>
  );

  if (!item) return <div className="text-center py-20">Data tidak ditemukan.</div>;

  return (
    <div className="pb-10 space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleBookmark(item)}
            className={`p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 ${
              isBookmarked(item.id) ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900"
            }`}
          >
            <Bookmark size={20} fill={isBookmarked(item.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
          {item.kategori}
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
          {item.pertanyaan}
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={14} /> Jawaban
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {item.jawaban}
          </p>
        </div>

        {item.ibarot && (
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ibarot (Teks Arab)</h3>
            <div 
              dir="rtl" 
              className="rtl-text text-xl sm:text-2xl leading-loose text-slate-800 dark:text-slate-100 bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/20"
            >
              {item.ibarot}
            </div>
          </div>
        )}

        <button 
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check size={18} className="text-emerald-500" />
              <span>Tersalin ke Papan Klip</span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span>Salin Jawaban</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
