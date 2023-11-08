import { create } from "zustand";

interface State {
  index: number;
  models: undefined[];
  previous: () => void;
  next: () => void;
}

export default create<State>((set) => {
  return {
    index: 0,
    models: [...new Array(8).fill(undefined)],
    previous: () => {
      set((state) => {
        if (state.index > 0) return { index: state.index - 1 };

        return state;
      });
    },

    next: () => {
      set((state) => {
        if (state.index < state.models.length - 1) {
          return { index: state.index + 1 };
        }
        return state;
      });
    }
  };
});
