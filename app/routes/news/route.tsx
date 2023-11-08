import { AnimationContainer } from "~/components/AnimationContainer";
import CarVid from "./car.mp4";
import Smol from "./smol.png";
import { ClientOnly } from "remix-utils/client-only";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  Scroll,
  ScrollControls,
  useTexture,
  useVideoTexture
} from "@react-three/drei";
import { damp } from "maath/easing";
import useStore from "./store";
import { Icon } from "~/components/Icons";
import * as THREE from "three";

const Newspaper = (
  props: JSX.IntrinsicElements["mesh"] & {
    index: number;
  }
) => {
  const ref = useRef<THREE.Mesh | null>(null);
  const controls = useThree(
    (state) => state.controls as unknown as CameraControls
  );

  useEffect(() => {
    if (controls && controls.mouseButtons) {
      controls.mouseButtons.right = 0;
      controls.mouseButtons.left = 0;
      controls.mouseButtons.wheel = 0;
      controls.touches.one = 0;
      controls.touches.two = 0;
      controls.touches.three = 0;
    }
  }, []);

  const [clicked, setClicked] = useState(false);

  const texture = useVideoTexture("videos/Issue_1.mp4");

  useEffect(() => {
    if (clicked && ref.current) {
      controls?.fitToBox(ref.current, true, {
        paddingLeft: 0.05,
        paddingRight: 0.05,
        paddingBottom: 0.05,
        paddingTop: 0.05
      });
      texture.image.muted = false;
      texture.image.volume = 0.4;
      texture.image.play();
    } else {
      controls?.reset(true);
      texture.image.muted = true;
    }
  }, [clicked]);

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={() => setClicked((clicked) => !clicked)}
      onPointerMissed={() => setClicked(false)}
    >
      <planeGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Scroller = ({ w = 2, gap = 0.15 }) => {
  const xW = w + gap;
  const group = useRef<THREE.Group | null>(null);
  const next = useStore((state) => state.next);
  const previous = useStore((state) => state.previous);
  const index = useStore((state) => state.index);
  const models = useStore((state) => state.models);
  useEffect(() => {
    const down = (_event: KeyboardEvent) => {
      if (_event.code === "ArrowRight" || _event.code === "Enter") next();
      else if (_event.code === "ArrowLeft" || _event.code === "Backspace")
        previous();
    };
    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);

  useFrame((state, delta) => {
    const target = -xW * index;
    damp(group.current!.position, "x", target, 0.2, delta);
  });

  return (
    <group ref={group} name="scroller">
      {models.map((_, i) => (
        <Newspaper
          key={i}
          index={i}
          position={[i * xW, 0, 0]}
          scale={[w, 2, 1]}
        />
      ))}
    </group>
  );
};

const Interface = () => {
  const next = useStore((state) => state.next);
  const previous = useStore((state) => state.previous);
  return (
    <>
      <button
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-neonPink/20 p-2 backdrop-blur-xl"
        onClick={() => next()}
      >
        <Icon name="chevron-up" className="h-24 w-24 rotate-90" />
      </button>
      <button
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-neonPink/20 p-2 backdrop-blur-xl"
        onClick={() => previous()}
      >
        <Icon name="chevron-up" className="h-24 w-24 -rotate-90" />
      </button>
    </>
  );
};

export default function News() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
        <>
          <Canvas
            camera={{
              position: [0, 0, 2.5]
            }}
          >
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
              <Scroller />
            </Suspense>
            <CameraControls makeDefault />
          </Canvas>
          <Interface />
        </>
      )}
    </ClientOnly>
  );
}
