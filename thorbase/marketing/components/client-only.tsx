"use client";

import { useEffect, useState } from "react";

/**
 * 只在客户端渲染内容的包装组件
 * 用于避免服务器端渲染和客户端渲染不匹配导致的 hydration 错误
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
