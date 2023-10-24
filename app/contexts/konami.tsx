import { createContext, useContext, useEffect, useState } from "react";
import { tinykeys } from "tinykeys";

const KonamiContext = createContext<{
  activated: boolean;
} | null>(null);

export const useKonami = () => {
  const context = useContext(KonamiContext);
  if (!context) {
    throw new Error("useKonami must be used within a KonamiProvider");
  }
  return context;
};

export const KonamiProvider = ({ children }: { children: React.ReactNode }) => {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a":
        () => {
          setActivated(!activated);
        }
    });
    return () => {
      unsubscribe();
    };
  });

  return (
    <KonamiContext.Provider value={{ activated }}>
      {children}
    </KonamiContext.Provider>
  );
};
