import { createContext, useContext, useEffect, useState } from "react";
import { tinykeys } from "tinykeys";

const EasterEggContext = createContext<{
  konamiActivated: boolean;
  lofiActivated: boolean;
} | null>(null);

export const useEasterEgg = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error("useEasterEgg must be used within a EasterEggProvider");
  }
  return context;
};

export const EasterEggProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [activated, setActivated] = useState<"konami" | "lofi" | null>(null);

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a":
        () => {
          if (activated === "konami") {
            setActivated(null);
            return;
          }
          setActivated("konami");
        },
      "k o n a m i": () => {
        if (activated === "konami") {
          setActivated(null);
          return;
        }
        setActivated("konami");
      },
      "l o f i": () => {
        if (activated === "lofi") {
          setActivated(null);
          return;
        }
        setActivated("lofi");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [activated]);

  let konamiActivated = activated === "konami";

  let lofiActivated = activated === "lofi";

  return (
    <EasterEggContext.Provider
      value={{
        konamiActivated,
        lofiActivated
      }}
    >
      {children}
    </EasterEggContext.Provider>
  );
};
