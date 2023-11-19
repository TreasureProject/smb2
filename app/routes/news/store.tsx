import { createStore } from "zustand";
import { createContext, useContext, useRef } from "react";

interface Props {
  models: {
    url: string;
    title: string;
  }[];
}

interface State extends Props {
  state: "idle" | "open";
  mailboxClicked: boolean;
  setMailboxClicked: (clicked: boolean) => void;
  setState: (state: "idle" | "open") => void;
  index: number;
  selectedModel: number | null;
  setSelectedModel: (index: number | null) => void;
  previous: () => void;
  next: (index?: number) => void;
}

type Store = ReturnType<typeof createModelStore>;

export const storeContext = createContext<Store | null>(null);

export const createModelStore = (initProps: Props) => {
  return createStore<State>()((set) => ({
    ...initProps,
    state: "idle",
    mailboxClicked: false,
    setMailboxClicked: (clicked) => set({ mailboxClicked: clicked }),
    setState: (state) => set({ state }),
    index: 0,
    selectedModel: null,
    setSelectedModel: (index) => {
      set({ selectedModel: index });
    },
    previous: () => {
      set((state) => {
        if (state.index > 0) return { index: state.index - 1 };

        return state;
      });
    },

    next: (index) => {
      set((state) => {
        if (index !== undefined) return { index };
        if (state.index < state.models.length - 1) {
          return { index: state.index + 1 };
        }
        return state;
      });
    }
  }));
};

export function useModelStore() {
  const store = useContext(storeContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}

export function StoreProvider({
  children,
  medias
}: {
  children: React.ReactNode;
  medias: {
    url: string;
    title: string;
  }[];
}) {
  const store = useRef(
    createModelStore({
      models: medias
    })
  ).current;
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
}
