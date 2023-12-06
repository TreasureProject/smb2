import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
  return defineConfig({
    ssr: {
      noExternal: [
        "tinykeys",
        "react-idle-timer",
        "@react-three/postprocessing",
        "maath",
        "react-states",
        ...(process.env.NODE_ENV === "development" ? [] : ["matter-js"])
      ]
    },
    plugins: [
      remix({
        ignoredRouteFiles: ["**/.*"]
        // appDirectory: "app",
        // assetsBuildDirectory: "public/build",
        // serverBuildPath: "build/index.js",
        // publicPath: "/build/",
      }),
      tsconfigPaths()
    ]
  });
};
