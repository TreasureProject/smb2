import { create } from "zustand";

export default create<{
  showIntro: boolean;
  setShowIntro: (showIntro: boolean) => void;
}>((set) => {
  return {
    showIntro: true,
    setShowIntro: (showIntro) => set({ showIntro })
  };
});
