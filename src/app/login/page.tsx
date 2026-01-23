"use client";

// 为什么要引入这些包呢
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Lock, User, Sparkles, Loader2, ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 登陆页面，需要提供account输入
  //const [account, ]   
  // 这个值，要在用户修改的时候随时改变 --> 需要采用React中的useState("")
  // 还需要有一个人来具体帮忙改值，所以需要setAccount
  //const [account, setAccount] = useState("")

  const [account, setAccount] = useState(""); //用来定义会随着用户操作而改变的变量，並且當這些變量改變時，React 會自動 重新渲染 頁面。
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter(); //用来处理页面跳转？
  
  // Use Convex mutations/queries
  const createUser = useMutation(api.users.user_creation);
  const allUsers = useQuery(api.users.users);


  
  // e就是event，捕獲React.FormEvent
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError("");

    try { //处理登陆逻辑
      // Simple client-side auth logic (for learning purpose)
      // In production, this should be done securely on the server/auth provider
      const existingUser = allUsers?.find(u => u.account === account);

      if (existingUser) {
        // Login attempt
        if (existingUser.password === password) {
          // Success
          localStorage.setItem("diary_user", account);
          localStorage.setItem("diary_key", password); // Use password as encryption key
          router.push("/");
        } else {
          setError("密碼錯誤，請重新輸入");
        }
      } else {
        // Auto-register if user doesn't exist
        await createUser({ account, password });
        localStorage.setItem("diary_user", account);
        localStorage.setItem("diary_key", password); // Use password as encryption key
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("登錄發生錯誤，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/20 transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-lg"
          title={theme === "dark" ? "切換到日間模式" : "切換到夜間模式"}
        >
          {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
        </button>
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full animate-pulse delay-700" />
      
      <main className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/5 dark:border-white/10 p-10 rounded-[2.5rem] shadow-xl dark:shadow-2xl transition-all">
          
          <header className="text-center mb-10">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 mb-4 ring-1 ring-indigo-500/20">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">歡迎回來</h1>
            <p className="text-zinc-500 mt-2 text-sm">請輸入您的憑據以進入私密空間</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-widest">帳號</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  required
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="Your account"
                  className="w-full bg-black/5 dark:bg-white/[0.05] border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-widest">密碼</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/5 dark:bg-white/[0.05] border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  進入日記本
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-600 text-xs">
              首次登錄將自動為您創建帳號
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
