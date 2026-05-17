"use client";

import React, { useEffect, useState } from "react";
import type * as ReactType from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
// import { Particles } from "../ui/particles";

export function ThemeProvider({
  children,
  ...props
}: ReactType.ComponentProps<typeof NextThemesProvider>) {
  // 在客户端渲染：显示 Particles 前 5 秒，然后隐藏以减少长期渲染/性能开销
  // const { theme } = useTheme();
  // const [showParticles, setShowParticles] = useState(true);

  // useEffect(() => {
  //   const t = setTimeout(() => setShowParticles(false), 5000);
  //   return () => clearTimeout(t);
  // }, []);

  return (
    <NextThemesProvider {...props}>
      {children}
      {/* {showParticles && theme === "dark" && (
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          ease={80}
          color={"#ffffff"}
          refresh
        />
      )} */}
    </NextThemesProvider>
  );
}
