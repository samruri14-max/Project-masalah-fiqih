import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { api } from "../services/api";
import { FiqhRecord } from "../types";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<FiqhRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [name]);

  const loadData = async () => {
    try {
      const data = await api.getAll();
      setItems(data.filter(i => i.kategori === name));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold uppercase tracking-wider">{name}</h2>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />)
        ) : items.length > 0 ? (
          items.map(item => (
            <Link 
              key={item.id}
              to={`/detail/${item.id}`}
              className="block p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-300"
            >
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 leading-snug">{item.pertanyaan}</h4>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{item.jawaban}</p>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 text-slate-500 italic">Belum ada data untuk kategori ini.</div>
        )}
      </div>
    </div>
  );
}
