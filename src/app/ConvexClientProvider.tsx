"use client"

//简单来说，这个脚本是，用来干嘛，用来拉起长时间连接线的人，让后端实时同步到前端
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// 這裡會讀取你 .env.local 裡的 NEXT_PUBLIC_CONVEX_URL
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}