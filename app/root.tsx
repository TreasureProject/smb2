import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigation,
  useFetchers,
  Outlet
} from "@remix-run/react";
import {
  AnimatePresence,
  MotionConfig,
  MotionValue,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import eeeImg from "~/assets/eee.png";
import { cn } from "./utils";
import iconHref from "./components/icons/sprite.svg";
import { ResponsiveProvider } from "./contexts/responsive";
import { EasterEggProvider, useEasterEgg } from "./contexts/easteregg";
import useStore from "~/store";

import "./tailwind.css";

import NProgress from "nprogress";
import { BananaCanvas } from "./components/BananaCanvas";
import { getDomainUrl } from "./seo";
import { SocketContextProvider, useSocket } from "./contexts/socket";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { ENABLED_CHAINS } from "./const";

NProgress.settings.template = `<div class="bar" role="bar"><div class="smol"></div><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`;

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: iconHref,
    as: "image",
    type: "image/svg+xml"
  }
];

export const loader = ({ request }: LoaderFunctionArgs) => {
  return json({
    requestInfo: {
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname
    }
  });
};

export type Loader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

function useNProgress() {
  let transition = useNavigation();

  let fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  let state = useMemo<"idle" | "loading">(
    function getGlobalState() {
      let states = [
        transition.state,
        ...fetchers.map((fetcher) => fetcher.state)
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [transition.state, fetchers]
  );

  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === "loading") NProgress.start();
    // // when the state is idle then we can to complete the progress bar
    if (state === "idle") NProgress.done();
  }, [state]);
}

export default function App() {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const overflowHide = location.pathname === "/gallery";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [config] = useState(() =>
    createConfig(
      getDefaultConfig({
        appName: "SMOL",
        alchemyId: import.meta.env.VITE_ALCHEMY_KEY,
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
        appDescription: "WE ARE SMOL.",
        appUrl: "https://smolverse.lol",
        appIcon: "https://smolverse.lol/favicon-32x32.png",
        chains: ENABLED_CHAINS
      })
    )
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <Meta />
        <Links />
      </head>
      <body
        className={cn(
          "relative !h-[100dvh] bg-[url(/img/stars.webp)] bg-repeat antialiased [overscroll-behavior:none]",
          isRoot || overflowHide ? "overflow-hidden" : null
        )}
        onMouseMove={({ currentTarget, clientX, clientY }) => {
          const { left, top } = currentTarget.getBoundingClientRect();
          mouseX.set(clientX - left - 40);
          mouseY.set(clientY - top - 40);
        }}
      >
        <EasterEggProvider>
          <WagmiConfig config={config}>
            <ConnectKitProvider
              customTheme={{
                "--ck-font-family": "PPFormula, sans-serif",
                "--ck-body-color": "#ffffff",
                "--ck-border-radius": "0px",
                "--ck-overlay-background": "rgba(230, 223, 115, 0.1)",
                "--ck-overlay-backdrop-filter": "blur(8px)",
                "--ck-primary-button-color": "#ffffff",
                "--ck-primary-button-background": "#1938F2",
                "--ck-primary-button-box-shadow":
                  "inset 0px 0px 0px 1px #d2bbce",
                "--ck-primary-button-border-radius": "0px",
                "--ck-primary-button-font-weight": "600",
                "--ck-primary-button-hover-color": "#ffffff",
                "--ck-primary-button-hover-background": "#1938F2",
                "--ck-primary-button-hover-box-shadow":
                  "0px 0px 0px 3px #1839f2b8",
                "--ck-primary-button-active-background": "#1938F2",
                "--ck-primary-button-active-box-shadow":
                  "inset 0px 0px 0px 2px #d2bbce",
                "--ck-secondary-button-color": "#000000",
                "--ck-secondary-button-background": "#F8FF1D",
                "--ck-secondary-button-box-shadow": "0px 0px 0px 2px #F8FF1D",
                "--ck-secondary-button-border-radius": "0px",
                "--ck-secondary-button-font-weight": "800",
                "--ck-secondary-button-hover-color": "#000000",
                "--ck-secondary-button-hover-background": "#F8FF1D",
                "--ck-secondary-button-hover-box-shadow":
                  "0px 0px 0px 4px #F8FF1D",
                "--ck-secondary-button-active-background": "#F8FF1D",
                "--ck-secondary-button-active-box-shadow":
                  "inset 0px 0px 0px 2px #d2bbce",
                "--ck-tertiary-button-color": "#d2bbce",
                "--ck-tertiary-button-background": "#fff",
                "--ck-tertiary-button-box-shadow":
                  "inset 0px 0px 0px 1px #d2bbce",
                "--ck-tertiary-button-border-radius": "10px",
                "--ck-tertiary-button-font-weight": "100",
                "--ck-tertiary-button-hover-color": "#ead3e6",
                "--ck-tertiary-button-hover-background": "#fff",
                "--ck-tertiary-button-hover-box-shadow":
                  "inset 0px 0px 0px 1px #ead3e6",
                "--ck-modal-box-shadow": "0px 2px 0px 1px #bf30ac",
                "--ck-body-background": "#bf30ac",
                "--ck-body-background-secondary": "#bf30ac",
                "--ck-body-background-tertiary": "#bf30ac",
                "--ck-body-color-muted": "#ffffff",
                "--ck-body-color-muted-hover": "#ffffff",
                "--ck-body-color-danger": "#ffffff",
                "--ck-body-color-valid": "#ffffff",
                "--ck-modal-heading-font-weight": "400",
                "--ck-focus-color": "#ffffff",
                "--ck-body-action-color": "#ffffff",
                "--ck-body-divider": "#bf30ac",
                "--ck-qr-dot-color": "#ffffff",
                "--ck-qr-background": "#503bbf",
                "--ck-qr-border-color": "#927fef",
                "--ck-qr-border-radius": "0px",
                "--ck-tooltip-color": "#ffffff",
                "--ck-tooltip-background": "#503bbf",
                "--ck-tooltip-background-secondary": "#503bbf",
                "--ck-tooltip-shadow": "0px 3px 0px 1px #503bbf",
                "--ck-spinner-color": "#ffffff",
                "--ck-recent-badge-color": "#000000",
                "--ck-recent-badge-background": "#F8FF1D",
                "--ck-recent-badge-border-radius": "0px",
                "--ck-body-disclaimer-color": "#ffffff",
                "--ck-body-disclaimer-link-color": "#ffffff",
                "--ck-body-disclaimer-link-hover-color": "#ffffff",
                "--ck-body-disclaimer-background": "#bf30ac"
              }}
            >
              <AppInner mouseX={mouseX} mouseY={mouseY} />
            </ConnectKitProvider>
          </WagmiConfig>
        </EasterEggProvider>
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

function AppInner({
  mouseX,
  mouseY
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const hue = useSpring(0, {
    stiffness: 100,
    damping: 20
  });

  const hueFilter = useMotionTemplate`hue-rotate(${hue}deg)`;

  const { konamiActivated } = useEasterEgg();

  useEffect(() => {
    const animation = animate(hue, 360, {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    });

    if (!konamiActivated) {
      animation.cancel();
      hue.set(0);
    }

    return () => animation.cancel();
  }, [konamiActivated, hue]);

  const showIntro = useStore((state) => state.showIntro);

  useNProgress();

  return (
    <motion.div
      style={{
        filter: hueFilter
      }}
      className="root h-full"
    >
      <SocketContextProvider>
        <svg width="0" height="0" aria-hidden="true">
          <defs>
            <filter id="outline">
              <feMorphology
                in="SourceAlpha"
                result="DILATED"
                operator="dilate"
                radius="4"
              ></feMorphology>

              <feFlood
                floodColor="#0E072D"
                floodOpacity="1"
                result="FUD"
              ></feFlood>
              <feComposite
                in="FUD"
                in2="DILATED"
                operator="in"
                result="OUTLINE"
              ></feComposite>

              <feMerge>
                <feMergeNode in="OUTLINE" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="rgb-split">
              <feOffset
                in="SourceGraphic"
                dx="0.5"
                dy="0.5"
                result="layer-one"
              />
              <feComponentTransfer in="layer-one" result="red">
                <feFuncR type="identity" />
                <feFuncG type="discrete" tableValues="0" />
                <feFuncB type="discrete" tableValues="0" />
              </feComponentTransfer>

              <feOffset
                in="SourceGraphic"
                dx="-0.5"
                dy="-0.5"
                result="layer-two"
              />
              <feComponentTransfer in="layer-two" result="cyan">
                <feFuncR type="discrete" tableValues="0" />
                <feFuncG type="identity" />
                <feFuncB type="identity" />
              </feComponentTransfer>

              <feBlend in="red" in2="cyan" mode="screen" result="color-split" />
            </filter>
          </defs>
        </svg>
        <ResponsiveProvider>
          <MotionConfig
            transition={{
              duration: 0.25,
              ease: "easeOut"
            }}
          >
            <AnimatePresence initial={false}>
              <Flick mouseX={mouseX} mouseY={mouseY} />
            </AnimatePresence>

            <div className="relative h-full">
              {!showIntro && <BananaCanvas />}
              <Outlet />
            </div>
          </MotionConfig>
        </ResponsiveProvider>
      </SocketContextProvider>
    </motion.div>
  );
}

const Flick = ({
  mouseX,
  mouseY
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) => {
  const { flicked } = useSocket();

  return (
    <>
      {flicked && (
        <motion.img
          transition={{
            type: "spring",
            mass: 0.6,
            duration: 1
          }}
          style={{
            x: mouseX,
            y: mouseY,
            position: "absolute",
            pointerEvents: "none",
            zIndex: 9999
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [0, 360]
          }}
          exit={{
            opacity: 0,
            scale: 0
          }}
          src={eeeImg}
          alt="eee"
          className="aspect-square h-auto w-12"
        />
      )}
    </>
  );
};
