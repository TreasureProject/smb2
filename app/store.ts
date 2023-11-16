import { create } from "zustand";

export default create<{
  showIntro: boolean;
  setShowIntro: (showIntro: boolean) => void;
  installedApps: string[];
  setInstalledApps: (installedApps: string[]) => void;
}>((set) => {
  return {
    showIntro: true,
    setShowIntro: (showIntro) => set({ showIntro }),
    installedApps: [],
    setInstalledApps: (installedApps) => set({ installedApps })
  };
});
