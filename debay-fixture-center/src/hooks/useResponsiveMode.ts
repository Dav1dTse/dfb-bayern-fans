import { useEffect, useState } from "react";

export type ResponsiveMode = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  viewportWidth: number;
};

const getResponsiveMode = (): ResponsiveMode => {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      viewportWidth: 1024,
    };
  }

  const viewportWidth = window.innerWidth;
  const isTouchDevice =
    "ontouchstart" in window || window.navigator.maxTouchPoints > 0;

  return {
    isMobile: viewportWidth < 768,
    isTablet: viewportWidth >= 768 && viewportWidth < 1024,
    isDesktop: viewportWidth >= 1024,
    isTouchDevice,
    viewportWidth,
  };
};

export function useResponsiveMode(): ResponsiveMode {
  const [mode, setMode] = useState(getResponsiveMode);

  useEffect(() => {
    const updateMode = () => setMode(getResponsiveMode());

    window.addEventListener("resize", updateMode);
    window.addEventListener("orientationchange", updateMode);

    return () => {
      window.removeEventListener("resize", updateMode);
      window.removeEventListener("orientationchange", updateMode);
    };
  }, []);

  return mode;
}
