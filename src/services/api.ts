import { FiqhRecord } from "../types";

export const api = {
  async getAll(): Promise<FiqhRecord[]> {
    const res = await fetch("/api/proxy?action=get");
    return res.json();
  },

  async getById(id: string | number): Promise<FiqhRecord> {
    const res = await fetch(`/api/proxy?action=get&id=${id}`);
    return res.json();
  },

  async search(query: string): Promise<FiqhRecord[]> {
    const res = await fetch(`/api/proxy?action=search&q=${encodeURIComponent(query)}`);
    return res.json();
  },

  async add(record: Omit<FiqhRecord, "id">): Promise<{ success: boolean; id?: number }> {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", ...record }),
    });
    return res.json();
  },

  async update(record: FiqhRecord): Promise<{ success: boolean }> {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "edit", ...record }),
    });
    return res.json();
  },

  async delete(id: number): Promise<{ success: boolean }> {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    return res.json();
  },

  async adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    
    if (!res.ok) {
      if (res.status === 401) return { success: false, error: "Password salah" };
      const text = await res.text();
      throw new Error(`Server returned ${res.status}: ${text.slice(0, 100)}`);
    }
    
    return res.json();
  }
};
