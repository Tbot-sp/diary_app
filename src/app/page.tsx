"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Book, Calendar, Trash2, Edit3, X } from "lucide-react";
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

const MOODS = ["🌞", "☁️", "🌧️", "⚡", "❄️", "🌈", "🔥", "💤"];

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  
  // State for new/editing diary entry
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [editingId, setEditingId] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stars, setStars] = useState<Array<{id: number, top: string, left: string, size: string, duration: string, delay: string, opacity: number}>>([]);

  // Generate stars on client side to avoid hydration mismatch
  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 1}px`,
        duration: `${Math.random() * 3 + 2}s`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.7 + 0.3,
      }));
    };
    setStars(generateStars());
  }, []);

  // Check auth on mount
  useEffect(() => {
    const user = localStorage.getItem("diary_user");
    if (!user) {
      router.push("/login");
    } else {
      setUserId(user);
    }
  }, [router]);

  // Convex hooks
  // Only run query if userId is present to avoid errors or empty queries
  const diaries = useQuery(api.diaries.list2, userId ? { userId } : "skip");
  const saveDiary = useMutation(api.diaries.save);
  const updateDiary = useMutation(api.diaries.update);
  const removeDiary = useMutation(api.diaries.remove);

  const handleLogout = () => {
    localStorage.removeItem("diary_user");
    router.push("/login");
  };

  // Encryption Helper
  const encrypt = (text: string) => {
    const key = localStorage.getItem("diary_key");
    if (!key) return text;
    return AES.encrypt(text, key).toString();
  };

  const decrypt = (ciphertext: string) => {
    const key = localStorage.getItem("diary_key");
    if (!key) return ciphertext;
    try {
      const bytes = AES.decrypt(ciphertext, key);
      const originalText = bytes.toString(encUtf8);
      // If decryption yields empty string but ciphertext wasn't, it might mean failure or empty content.
      // However, AES.decrypt usually returns something. If key is wrong, it might return garbage.
      // If ciphertext is not valid base64/aes, it might throw or return empty.
      return originalText || ciphertext; // Fallback to original if decryption "fails" (e.g. not encrypted)
    } catch (e) {
      return ciphertext; // Not encrypted or error
    }
  };

  const decryptMood = (ciphertext: string | undefined) => {
    if (!ciphertext) return "";
    const decrypted = decrypt(ciphertext);
    // 如果解密結果等於密文本身，且密文看起來像 AES 加密串，
    // 或者解密結果為空，說明這可能是一個無效的或空的加密心情
    if (decrypted === ciphertext && ciphertext.length > 10) return "";
    return decrypted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDiary({
          id: editingId,
          title: encrypt(title),
          content: encrypt(content),
          mood: mood ? encrypt(mood) : undefined,
        });
      } else {
        await saveDiary({
          title: encrypt(title),
          content: encrypt(content),
          mood: mood ? encrypt(mood) : undefined,
          userId
        });
      }
      // Clear form
      resetForm();
    } catch (error) {
      console.error("Failed to save diary:", error);
      alert("保存失敗，請重試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (diary: any) => {
    setEditingId(diary._id);
    setTitle(decrypt(diary.title));
    setContent(decrypt(diary.content));
    setMood(diary.mood ? decrypt(diary.mood) : "");
    // Scroll to top or form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: any) => {
    if (confirm("確定要刪除這篇日記嗎？")) {
      try {
        await removeDiary({ id });
        if (editingId === id) resetForm();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("");
    setEditingId(null);
  };

  if (!userId) {
    return null; // Or a loading spinner while checking auth
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full animate-bounce duration-[10000ms] opacity-50" />
        
        {/* Starry Sky */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDuration: star.duration,
              animationDelay: star.delay,
              boxShadow: `0 0 ${parseInt(star.size) * 2}px rgba(255, 255, 255, 0.8)`
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Book className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-lg tracking-tight">我的日記本</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">
              嗨，<span className="text-white font-medium">{userId}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title="登出"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12 relative z-10">
        
        {/* Top Section: Wider Input Form */}
        <section className="w-full">
          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            {/* Subtle background glow for the form */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
            
            <h2 className="text-2xl font-bold mb-8 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${editingId ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  {editingId ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                {editingId ? "修改這篇精彩的回憶" : "今天有什麼值得記錄的？"}
              </span>
              {editingId && (
                <button 
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all text-sm font-medium border border-transparent hover:border-white/10"
                >
                  <X className="w-4 h-4" />
                  取消編輯
                </button>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">標題</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="給這段回憶起個名字..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-xl font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-inner"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">內容</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="在這裡盡情傾訴..."
                    rows={8}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-lg leading-relaxed text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">心情</label>
                  <div className="flex gap-4 flex-wrap">
                    {MOODS.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(m)}
                        className={`text-2xl p-4 rounded-2xl transition-all border ${
                          mood === m 
                            ? "bg-indigo-500/20 border-indigo-500/50 scale-110 shadow-lg shadow-indigo-500/20" 
                            : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:scale-105"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-10 py-4 font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-lg ${
                    editingId 
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25" 
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25"
                  } disabled:bg-zinc-800 text-white active:scale-95`}
                >
                  {isSubmitting ? "處理中..." : editingId ? "完成修改" : "保存這段時光"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Bottom Section: Diary List */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <Book className="w-6 h-6 text-indigo-400" />
              </div>
              過往回憶
            </h2>
            <div className="text-sm text-zinc-500 font-medium">
              共計 <span className="text-indigo-400">{diaries?.length || 0}</span> 篇日記
            </div>
          </div>

          {!diaries ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-zinc-500 font-medium animate-pulse">正在開啟時光機...</p>
            </div>
          ) : diaries.length === 0 ? (
            <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] p-20 text-center group">
              <div className="inline-flex p-6 rounded-3xl bg-zinc-900 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Book className="w-12 h-12 text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-lg font-medium">這裏空空如也，快來寫下第一篇日記吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diaries.map((diary) => (
                <div 
                  key={diary._id} 
                  className={`group bg-white/[0.03] hover:bg-white/[0.05] border rounded-[2rem] p-8 transition-all duration-500 relative overflow-hidden ${
                    editingId === diary._id ? "border-indigo-500 ring-4 ring-indigo-500/10" : "border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors leading-tight flex items-center gap-2">
                          <span>{decrypt(diary.title)}</span>
                          {decryptMood(diary.mood) && <span className="text-2xl" title="當時的心情">{decryptMood(diary.mood)}</span>}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(diary._creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={() => handleEdit(diary)}
                        className="p-2.5 bg-white/5 hover:bg-indigo-500/20 rounded-xl text-zinc-400 hover:text-indigo-400 transition-all border border-white/5"
                        title="編輯"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(diary._id)}
                        className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-xl text-zinc-400 hover:text-red-400 transition-all border border-white/5"
                        title="刪除"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap relative z-10 line-clamp-6 group-hover:line-clamp-none transition-all">
                    {decrypt(diary.content)}
                  </p>
                  
                  {/* Subtle card glow on hover */}
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-700" />
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
