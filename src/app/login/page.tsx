"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { User, Sparkles, ArrowRight, Key } from "lucide-react";
import * as THREE from "three";

type VantaEffect = { destroy: () => void };
type VantaFactory = (options: Record<string, unknown>) => VantaEffect;

export default function LoginPage() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Vanta.js ref
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<VantaEffect | null>(null);

  const router = useRouter();
  
  const createUser = useMutation(api.users.user_creation);
  const allUsers = useQuery(api.users.users);

  // Initialize Vanta.js effect
  useEffect(() => {
    let cancelled = false;

    const initVanta = async () => {
      if (!vantaEffectRef.current && vantaRef.current) {
        const w = window as unknown as { THREE: typeof THREE };
        w.THREE = THREE;

        try {
          // @ts-expect-error: Vanta.js lacks types
          const birdsModule: unknown = await import("vanta/dist/vanta.birds.min");
          const maybeDefault = (birdsModule as { default?: unknown }).default;
          const factoryUnknown = typeof maybeDefault === "function" ? maybeDefault : birdsModule;
          if (typeof factoryUnknown !== "function") return;

          const BIRDS = factoryUnknown as VantaFactory;
          const effect = BIRDS({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0x050f20, // 深藍色背景
            color1: 0xff0000,         // 紅色
            color2: 0x00d1ff,         // 青色
            birdSize: 1.0,
            wingSpan: 30.0,
            speedLimit: 5.0,
            separation: 20.0,
            alignment: 20.0,
            cohesion: 20.0,
            quantity: 5.0
          } satisfies Record<string, unknown>);

          if (!cancelled) vantaEffectRef.current = effect;
        } catch (err) {
          console.error("Vanta initialization failed:", err);
        }
      }
    };

    initVanta();

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
      cancelled = true;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError("");

    try {
      const existingUser = allUsers?.find(u => u.account === account);

      if (existingUser) {
        if (existingUser.password === password) {
          localStorage.setItem("diary_user", account);
          localStorage.setItem("diary_key", password);
          router.push("/");
        } else {
          setError("密碼錯誤，請重新輸入");
        }
      } else {
        await createUser({ account, password });
        localStorage.setItem("diary_user", account);
        localStorage.setItem("diary_key", password);
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
    <div ref={vantaRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/35 pointer-events-none" />

      <main className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-10 rounded-[2rem] shadow-2xl shadow-black/30 transition-all duration-500 hover:bg-white/12 hover:border-white/25">
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 ring-1 ring-white/20 shadow-[0_0_24px_rgba(0,209,255,0.18)]">
              <Sparkles className="w-8 h-8 text-cyan-200" />
            </div>
            <h1 className="text-4xl font-light text-white/90 tracking-tight mb-2 font-serif">Diary</h1>
            <p className="text-white/60 text-sm tracking-wide">記錄您生活中的每一個瞬間</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/55 ml-1 uppercase tracking-widest">Account</label>
              <div className="relative group">
                <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/75 drop-shadow-sm group-focus-within:text-cyan-100 transition-colors" />
                <input
                  type="text"
                  required
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="輸入您的帳號"
                  className="w-full bg-white/15 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/35 focus:border-cyan-200/50 focus:bg-white/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/55 ml-1 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Key className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/75 drop-shadow-sm group-focus-within:text-cyan-100 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="輸入您的密碼"
                  className="w-full bg-white/15 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/35 focus:border-cyan-200/50 focus:bg-white/20 transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-white/12 text-white font-medium py-4 rounded-xl shadow-lg shadow-black/25 hover:bg-white/16 hover:shadow-black/40 active:scale-[0.98] transition-all duration-300 overflow-hidden border border-white/10 hover:border-white/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? "處理中..." : "進入空間"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/25 via-fuchsia-500/20 to-cyan-500/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/45">
              首次登錄將自動創建帳號 • 端對端加密保護
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
