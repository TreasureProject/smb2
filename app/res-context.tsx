import { useIsomorphicLayoutEffect } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
};

const ResponsiveContext = createContext<{
  isMobile: boolean;
} | null>(null);

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error("useResponsive must be used within a ResponsiveProvider");
  }
  return context;
};

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    addEventListener("resize", handleSize);
    return () => removeEventListener("resize", handleSize);
  }, []);
  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return windowSize;
}

export const ResponsiveProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { width: windowWidth } = useWindowSize();

  const isMobile = windowWidth < 640;

  return (
    <ResponsiveContext.Provider value={{ isMobile }}>
      {children}
    </ResponsiveContext.Provider>
  );
};
