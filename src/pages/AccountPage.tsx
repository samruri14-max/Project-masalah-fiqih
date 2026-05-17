import { Link } from "react-router-dom";
import { User, LogOut, ShieldCheck, ChevronRight, Share2, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function AccountPage() {
  const { darkMode, toggleDarkMode } = useTheme();

  const handleShareApp = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Kumpulan Masalah Fiqih",
          text: "Aplikasi kumpulan masalah fiqih modern dengan database Google Spreadsheet. Yuk download sekarang!",
          url: window.location.origin,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.origin);
        alert("Link aplikasi berhasil disalin ke papan klip!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 pt-4">
        <div className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-100 dark:shadow-none">
          <User size={48} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Pengguna App</h2>
          <p className="text-sm text-slate-500 italic uppercase tracking-widest text-[10px] font-bold">Versi 1.0.0</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Menu Utama</h3>
        
        <div className="space-y-2">
          <MenuLink icon={<ShieldCheck size={20} />} label="Panel Admin" to="/admin" />
        </div>

        <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-widest pt-4">Lainnya</h3>
        
        <div className="space-y-2">
          <button 
            onClick={toggleDarkMode}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-slate-500">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {darkMode ? "Mode Terang" : "Mode Gelap"}
                </span>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          </button>

          <button 
            onClick={handleShareApp}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-slate-500"><Share2 size={20} /></div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Bagikan Aplikasi</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </div>
          </button>
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 w-full py-4 text-red-500 font-bold bg-red-50 dark:bg-red-500/10 rounded-2xl">
        <LogOut size={20} /> KELUAR
      </button>
    </div>
  );
}

function MenuLink({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <Link 
      to={to} 
      className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <div className="flex items-center gap-3">
        <div className="text-slate-500">{icon}</div>
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
    </Link>
  );
}
