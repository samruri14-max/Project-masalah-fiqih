import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Lock, BarChart3, Users, BookOpen, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../services/api";
import { FiqhRecord, CATEGORIES } from "../types";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FiqhRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<FiqhRecord> | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem("admin_token", res.token!);
        loadData();
      } else {
        setError(res.error || "Password salah");
      }
    } catch (e) {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecord) return;
    
    setLoading(true);
    try {
      let res;
      if (currentRecord.id) {
        res = await api.update(currentRecord as FiqhRecord);
      } else {
        res = await api.add(currentRecord as Omit<FiqhRecord, "id">);
      }
      
      if (res.success) {
        setShowForm(false);
        setCurrentRecord(null);
        loadData();
      }
    } catch (e) {
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    setLoading(true);
    try {
      const res = await api.delete(id);
      if (res.success) loadData();
    } catch (e) {
      alert("Gagal menghapus data");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm glass-card p-8 space-y-6"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Lock size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Login</h2>
              <p className="text-sm text-slate-500">Masukkan password untuk akses dashboard</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
              {error && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold tracking-wide hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {loading ? "Loading..." : "MASUK"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Masalah</p>
            <p className="text-xl font-bold">{items.length}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Kategori</p>
            <p className="text-xl font-bold">{CATEGORIES.length}</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Kelola Data</h2>
        <button 
          onClick={() => {
            setCurrentRecord({ kategori: "Thaharah", pertanyaan: "", jawaban: "", ibarot: "" });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 dark:shadow-none"
        >
          <Plus size={18} /> Tambah
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading && items.length === 0 ? (
           Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)
        ) : (
          items.map(item => (
            <div key={item.id} className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">{item.kategori}</span>
                <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.pertanyaan}</h4>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => {
                    setCurrentRecord(item);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upsert Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{currentRecord?.id ? "Edit Data" : "Tambah Data"}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                  <select 
                    value={currentRecord?.kategori}
                    onChange={(e) => setCurrentRecord({...currentRecord, kategori: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Pertanyaan</label>
                  <textarea 
                    value={currentRecord?.pertanyaan}
                    required
                    onChange={(e) => setCurrentRecord({...currentRecord, pertanyaan: e.target.value})}
                    placeholder="Apa hukum..."
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Jawaban</label>
                  <textarea 
                    value={currentRecord?.jawaban}
                    required
                    onChange={(e) => setCurrentRecord({...currentRecord, jawaban: e.target.value})}
                    placeholder="Boleh/Tidak boleh karena..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ibarot (Arab)</label>
                  <textarea 
                    dir="rtl"
                    value={currentRecord?.ibarot}
                    onChange={(e) => setCurrentRecord({...currentRecord, ibarot: e.target.value})}
                    placeholder="الماء المستعمل..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none font-arabic text-right text-lg"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold tracking-wide hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "DIPROSES..." : (
                    <>
                      <Save size={20} />
                      SIMPAN DATA
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
