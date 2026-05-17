import { useState, useEffect } from "react";
import { FiqhRecord } from "../types";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<FiqhRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("fiqh_bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  const toggleBookmark = (record: FiqhRecord) => {
    const isBookmarked = bookmarks.some(b => b.id === record.id);
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(b => b.id !== record.id);
    } else {
      newBookmarks = [...bookmarks, record];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem("fiqh_bookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (id: number) => bookmarks.some(b => b.id === id);

  return { bookmarks, toggleBookmark, isBookmarked };
}
