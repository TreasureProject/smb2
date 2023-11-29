import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import million from "million/compiler";

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
        "matter-js"
      ]
    },
    plugins: [
      million.vite({ auto: true, mode: "react", server: true, mute: true }),
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
