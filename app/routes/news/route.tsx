import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { CameraControls, useCursor, useVideoTexture } from "@react-three/drei";
import { damp, damp3 } from "maath/easing";
import { useModelStore, StoreProvider } from "./store";
import { Icon } from "~/components/Icons";
import * as THREE from "three";
import { Mailbox } from "./Mailbox";
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  useMotionTemplate,
  useSpring
} from "framer-motion";
import { cn } from "~/utils";
import { tinykeys } from "tinykeys";
import { commonMeta } from "~/seo";
import { Await, useLoaderData } from "@remix-run/react";
import { fetchSmolNews } from "~/api.server";
import { defer } from "@remix-run/node";
import { useStore } from "zustand";
import { Header } from "~/components/Header";

export const meta = commonMeta;

const material = new THREE.LineBasicMaterial({ color: "white" });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.5, 0),
  new THREE.Vector3(0, 0.5, 0)
]);

function Minimap() {
  const ref = useRef<THREE.Group | null>(null);
  const store = useModelStore();
  const models = useStore(store, (s) => s.models);
  const { height } = useThree((state) => state.viewport);
  const cameraIndex = useStore(store, (s) => s.index);

  useFrame((state, delta) => {
    ref.current!.children.forEach((child, index) => {
      const y =
        cameraIndex === index
          ? 1
          : cameraIndex + 1 === index
          ? 0.5
          : cameraIndex - 1 === index
          ? 0.5
          : cameraIndex + 2 === index
          ? 0.25
          : cameraIndex - 2 === index
          ? 0.25
          : 0;
      damp(child.scale, "y", 0.1 + y / 6, 0.1, delta);
    });
  });
  return (
    <group ref={ref}>
      {models.map((_, i) => (
        <line
          key={i}
          // @ts-ignore
          geometry={geometry}
          material={material}
          position={[i * 0.06 - models.length * 0.03, -height / 2 + 2.5, 0]}
        />
      ))}
    </group>
  );
}

const Newspaper = (
  props: JSX.IntrinsicElements["mesh"] & {
    index: number;
    model: {
      url: string;
      title: string;
    };
  }
) => {
  const ref = useRef<THREE.Mesh | null>(null);
  const controls = useThree(
    (state) => state.controls as unknown as CameraControls
  );
  const store = useModelStore();

  const setSelected = useStore(store, (state) => state.setSelectedModel);
  const selected =
    useStore(store, (state) => state.selectedModel) === props.index;

  const texture = useVideoTexture(props.model.url);

  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  useEffect(() => {
    if (selected && ref.current) {
      texture.image.playsInline = true;

      controls?.fitToBox(ref.current, true, {
        paddingLeft: 0.05,
        paddingRight: 0.05,
        paddingBottom: 0.05,
        paddingTop: 0.05
      });
      texture.image.muted = false;
      texture.image.volume = 0.03;
      texture.image.play();
    } else {
      controls?.reset(true);
      texture.image.muted = true;
      texture.image.pause();
      texture.image.currentTime = 0;
    }
  }, [selected]);

  return (
    <mesh
      {...props}
      ref={ref}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setSelected(selected ? null : props.index);
        // need this for mobile safari
        texture.image.muted = false;
      }}
      onPointerMissed={() => {
        if (selected) setSelected(null);
      }}
    >
      <planeGeometry args={[1, 1, 1]} />
      <Suspense
        fallback={<meshStandardMaterial side={THREE.DoubleSide} wireframe />}
      >
        <meshStandardMaterial map={texture} />
      </Suspense>
    </mesh>
  );
};

const Newspapers = ({ w = 2, gap = 0.15 }) => {
  const xW = w + gap;
  const group = useRef<THREE.Group | null>(null);
  const store = useModelStore();
  const next = useStore(store, (state) => state.next);
  const previous = useStore(store, (state) => state.previous);
  const index = useStore(store, (state) => state.index);
  const models = useStore(store, (state) => state.models);
  const selectedModel = useStore(store, (state) => state.selectedModel);

  const hasSelectedModel = selectedModel !== null;

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      ArrowRight: () => {
        if (!hasSelectedModel) {
          next();
        }
      },
      ArrowLeft: () => {
        if (!hasSelectedModel) {
          previous();
        }
      },
      Enter: () => {
        if (!hasSelectedModel) {
          next();
        }
      },
      Backspace: () => {
        if (!hasSelectedModel) {
          previous();
        }
      }
    });
    return () => {
      unsubscribe();
    };
  });

  useFrame((_, delta) => {
    const target = -xW * index;
    damp(group.current!.position, "x", target, 0.2, delta);
  });

  return (
    <group ref={group}>
      {models.map((model, i) => (
        <Newspaper
          key={i}
          index={i}
          model={model}
          position={[i * xW, 0, 0]}
          scale={[w, 2, 1]}
        />
      ))}
    </group>
  );
};

const longPressThreshold = 1000;

const LongClickButton = ({
  onLongClick,
  onClick,
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  onLongClick?: () => void;
} & HTMLMotionProps<"button">) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggeredRef = useRef(false);

  const height = useSpring(0, {
    stiffness: 100,
    damping: 20
  });

  const h = useMotionTemplate`${height}%`;

  const startPressTimer = () => {
    const intentTimerId = setTimeout(() => {
      height.set(100);
    }, 100);

    const timerId = setTimeout(() => {
      onLongClick?.();
      longPressTriggeredRef.current = true;
    }, longPressThreshold);
    longPressTriggeredRef.current = false;
    timerRef.current = timerId;
    intentTimerRef.current = intentTimerId;
  };

  const clearPressTimer = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!timerRef.current || !intentTimerRef.current) return;

    if (!longPressTriggeredRef.current) {
      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
    }
    clearTimeout(intentTimerRef.current);
    clearTimeout(timerRef.current);
    timerRef.current = null;
    intentTimerRef.current = null;
    height.set(0);
  };

  const cancelPressTimer = () => {
    if (!timerRef.current || !intentTimerRef.current) return;

    clearTimeout(timerRef.current);
    clearTimeout(intentTimerRef.current);

    timerRef.current = null;
    longPressTriggeredRef.current = false;
    intentTimerRef.current = null;
    height.set(0);
  };

  return (
    <motion.button
      onMouseDown={startPressTimer}
      onMouseUp={clearPressTimer}
      onMouseLeave={cancelPressTimer}
      onTouchStart={startPressTimer}
      onTouchEnd={clearPressTimer}
      onTouchMove={cancelPressTimer}
      className={cn("group relative select-none overflow-hidden", className)}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <motion.div
        style={{
          height: h
        }}
        transition={{
          duration: longPressThreshold
        }}
        className="absolute -inset-[0.1px] mt-auto h-full w-full bg-intro"
      />
    </motion.button>
  );
};

const Kbd = ({ children }: { children: React.ReactNode }) => {
  return (
    <kbd className="box-border inline-flex h-6 shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md bg-slate-100 px-2 text-black shadow-md shadow-slate-500/40 font-mono text-xs">
      {children}
    </kbd>
  );
};

const Interface = () => {
  const store = useModelStore();
  const next = useStore(store, (state) => state.next);
  const models = useStore(store, (state) => state.models);
  const previous = useStore(store, (state) => state.previous);
  const selectedModel = useStore(store, (state) => state.selectedModel);
  const state = useStore(store, (state) => state.state);
  const notSelected = selectedModel === null && state === "open";
  const setMailboxClicked = useStore(store, (state) => state.setMailboxClicked);
  const setState = useStore(store, (state) => state.setState);
  return (
    <div className={cn(state === "idle" && "absolute inset-0")}>
      {state === "idle" && (
        <button
          className="absolute inset-0 h-full w-full"
          onClick={() => {
            setMailboxClicked(true);
            setTimeout(() => {
              setState("open");
            }, 2000);
          }}
        ></button>
      )}
      <AnimatePresence>
        {notSelected && (
          <motion.div
            key="interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.2
            }}
          >
            <div className="absolute right-4 top-4 hidden space-y-3 text-white font-mono sm:block">
              <div className="flex items-center justify-between space-x-8">
                <div className="space-x-1">
                  <Kbd>← / Backspace</Kbd>
                  <Kbd>→ / Enter</Kbd>
                </div>
                <span className="text-grayTwo text-xs">Navigate</span>
              </div>
              <div className="flex items-center justify-between space-x-8">
                <div className="space-x-1">
                  <Kbd>
                    <Icon name="longpress" className="h-4 w-4" />
                    Longclick Arrows
                  </Kbd>
                </div>
                <span className="text-grayTwo text-xs">First/Last</span>
              </div>
            </div>
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 space-x-4 sm:bottom-8">
              <LongClickButton
                className="drounded-xl bg-black p-1.5 text-white backdrop-blur-xl"
                onClick={() => previous()}
                onLongClick={() => {
                  next(0);
                }}
              >
                <Icon
                  name="chevron-up"
                  className="sm:h7 sm:w7 h-6 w-6 -rotate-90"
                />
              </LongClickButton>
              <LongClickButton
                className="drounded-xl bg-black p-1.5 text-white backdrop-blur-xl"
                onClick={() => next()}
                onLongClick={() => {
                  next(models.length - 1);
                }}
              >
                <Icon
                  name="chevron-up"
                  className="sm:h7 sm:w7 h-6 w-6 rotate-90"
                />
              </LongClickButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Experience = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const store = useModelStore();
  const state = useStore(store, (state) => state.state);
  const { height } = useThree((state) => state.viewport);
  const isOpen = state === "open";

  useFrame((_, delta) => {
    if (isOpen) {
      damp3(groupRef.current!.position, [0, 0, 2.5], 0.6, delta);
    }
  });

  return (
    <group ref={groupRef} position={[0, -height, 0]}>
      {children}
    </group>
  );
};

export const loader = async () => {
  const medias = fetchSmolNews();

  return defer({ medias });
};

export default function News() {
  const { medias } = useLoaderData<typeof loader>();

  return (
    <Suspense
      fallback={
        <div className="grid h-full place-items-center text-white font-mono text-lg">
          Loading...
        </div>
      }
    >
      <Await resolve={medias}>
        {(mediaList) => {
          return (
            <StoreProvider medias={mediaList}>
              <div className="flex h-full flex-col">
                <Header name="News" />

                <div className="relative flex-1">
                  <Canvas className="canvas">
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight
                      position={[10, 10, 10]}
                      angle={0.15}
                      penumbra={1}
                      decay={0}
                      intensity={Math.PI}
                    />
                    <pointLight
                      position={[-10, -10, -10]}
                      decay={0}
                      intensity={Math.PI}
                    />
                    <Suspense fallback={null}>
                      <Experience>
                        <Newspapers />
                        <Minimap />
                      </Experience>
                      <Mailbox />
                    </Suspense>
                    <CameraControls
                      touches={{
                        one: 0,
                        two: 0,
                        three: 0
                      }}
                      mouseButtons={{
                        left: 0,
                        right: 0,
                        wheel: 0,
                        middle: 0
                      }}
                      makeDefault
                    />
                  </Canvas>
                  <Interface />
                </div>
              </div>
            </StoreProvider>
          );
        }}
      </Await>
    </Suspense>
  );
}
