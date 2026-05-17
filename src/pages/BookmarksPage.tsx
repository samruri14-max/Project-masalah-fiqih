import { Link } from "react-router-dom";
import { Bookmark, Search } from "lucide-react";
import { useBookmarks } from "../hooks/useBookmarks";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Tersimpan</h2>

      <div className="space-y-3">
        {bookmarks.length > 0 ? (
          bookmarks.map(item => (
            <Link 
              key={item.id}
              to={`/detail/${item.id}`}
              className="block p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase">
                  {item.kategori}
                </span>
                <Bookmark size={12} className="text-emerald-600" fill="currentColor" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 leading-snug">{item.pertanyaan}</h4>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <Bookmark size={48} strokeWidth={1} />
            <div className="text-center">
              <p className="font-medium text-slate-600 dark:text-slate-400">Belum ada simpanan</p>
              <p className="text-xs">Klik ikon bookmark pada artikel untuk menyimpannya di sini.</p>
            </div>
            <Link to="/search" className="flex items-center gap-2 text-sm text-emerald-600 font-bold px-6 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
              <Search size={16} /> Cari Masalah
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
