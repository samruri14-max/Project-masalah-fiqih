import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, Bookmark, User, LayoutGrid, ChevronLeft, Moon, Sun, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Pages
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AccountPage from "./pages/AccountPage";
import BookmarksPage from "./pages/BookmarksPage";
import DetailPage from "./pages/DetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryPage from "./pages/CategoryPage";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const { darkMode } = useTheme();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', darkMode ? '#0f172a' : '#059669');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">F</div>
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">Fiqih App</h1>
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="max-w-lg mx-auto h-16 flex items-center justify-around px-2">
          <NavLink to="/" icon={<Home size={22} />} label="Home" />
          <NavLink to="/search" icon={<Search size={22} />} label="Cari" />
          <NavLink to="/bookmarks" icon={<Bookmark size={22} />} label="Simpan" />
          <NavLink to="/account" icon={<User size={22} />} label="Akun" />
        </div>
      </nav>
    </div>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300",
        isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-500"
      )}
    >
      <div className={cn(
        "p-1 rounded-xl transition-all duration-300",
        isActive && "bg-emerald-50 dark:bg-emerald-500/10 scale-110"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
      {isActive && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-500 mt-0.5"
        />
      )}
    </Link>
  );
}
