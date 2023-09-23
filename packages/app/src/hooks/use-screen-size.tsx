'use client'

import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<number>(480)

  useEffect(() => {
    if (window === undefined) return
    window?.addEventListener("resize", () => {
      setScreenSize(window?.innerWidth)
    });
    return () => {
      window?.removeEventListener("resize", () => {
        setScreenSize(window?.innerWidth)
      })
    }
  }, []);

  return { screenSize }
}
