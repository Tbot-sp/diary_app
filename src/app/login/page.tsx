"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { User, Sparkles, ArrowRight, Key } from "lucide-react";
import * as THREE from "three";
import { themes } from "../../lib/theme";

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
  
  // Use the same theme as the main page (clouds mode for consistency)
  const theme = themes.clouds;

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
        <div className={`${theme.card} p-10 rounded-[2rem] group`}>
          
          <header className="text-center mb-10">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${theme.moodBtn} shadow-[0_0_30px_rgba(0,209,255,0.2)] group-hover:shadow-[0_0_40px_rgba(255,0,0,0.2)] transition-all duration-700`}>
              <Sparkles className="w-8 h-8 text-cyan-200 group-hover:text-rose-200 transition-colors duration-700" />
            </div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-2 drop-shadow-lg">Diary</h1>
            <p className={`${theme.textMuted} text-sm tracking-wide`}>記錄生活中的酸甜苦辣和偉大的創意</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-xs font-medium ${theme.textMuted} ml-1 uppercase tracking-widest`}>Account</label>
              <div className="relative group/input">
                <User className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textDim} drop-shadow-sm group-focus-within/input:text-white transition-all duration-300`} />
                <input
                  type="text"
                  required
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="輸入您的帳號"
                  className={`w-full ${theme.input} rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-medium ${theme.textMuted} ml-1 uppercase tracking-widest`}>Password</label>
              <div className="relative group/input">
                <Key className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textDim} drop-shadow-sm group-focus-within/input:text-white transition-all duration-300`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="輸入您的密碼"
                  className={`w-full ${theme.input} rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300`}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center animate-pulse backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`group/btn relative w-full ${theme.moodBtn} text-white font-medium py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300 overflow-hidden`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? "處理中..." : "進入空間"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-xs ${theme.textDim} hover:text-white/50 transition-colors`}>
              首次登錄將自動創建帳號 • 端對端加密保護
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
