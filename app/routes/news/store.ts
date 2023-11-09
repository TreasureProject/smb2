import { create } from "zustand";

interface State {
  state: "idle" | "open";
  setState: (state: "idle" | "open") => void;
  index: number;
  selectedModel: number | null;
  setSelectedModel: (index: number | null) => void;
  models: undefined[];
  previous: () => void;
  next: (index?: number) => void;
}

export default create<State>((set) => {
  return {
    state: "idle",
    setState: (state) => set({ state }),
    index: 0,
    models: [...new Array(12).fill(undefined)],
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
        if (index) return { index };
        if (state.index < state.models.length - 1) {
          return { index: state.index + 1 };
        }
        return state;
      });
    }
  };
});
