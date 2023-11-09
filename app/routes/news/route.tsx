import { AnimationContainer } from "~/components/AnimationContainer";
import CarVid from "./car.mp4";
import Smol from "./smol.png";
import { ClientOnly } from "remix-utils/client-only";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  Center,
  MeshTransmissionMaterial,
  useCursor,
  useVideoTexture
} from "@react-three/drei";
import { damp, damp3, dampC } from "maath/easing";
import useStore from "./store";
import { Icon } from "~/components/Icons";
import * as THREE from "three";
import { Mailbox } from "./Mailbox";
import { useControls } from "leva";
const material = new THREE.LineBasicMaterial({ color: "white" });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.5, 0),
  new THREE.Vector3(0, 0.5, 0)
]);

function Minimap() {
  const ref = useRef<THREE.Group | null>(null);
  const models = useStore((state) => state.models);
  const { height } = useThree((state) => state.viewport);

  const cameraIndex = useStore((state) => state.index);
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
  }
) => {
  const ref = useRef<THREE.Mesh | null>(null);
  const controls = useThree(
    (state) => state.controls as unknown as CameraControls
  );
  const setSelected = useStore((state) => state.setSelectedModel);
  const selected = useStore((state) => state.selectedModel) === props.index;

  const texture = useVideoTexture("videos/Issue_1.mp4");

  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  useEffect(() => {
    if (selected && ref.current) {
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
  }, [selected]);

  return (
    <mesh
      {...props}
      ref={ref}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={() => setSelected(selected ? null : props.index)}
      onPointerMissed={() => setSelected(null)}
    >
      <planeGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Newspapers = ({ w = 2, gap = 0.15 }) => {
  const xW = w + gap;
  const group = useRef<THREE.Group | null>(null);
  const next = useStore((state) => state.next);
  const previous = useStore((state) => state.previous);
  const index = useStore((state) => state.index);
  const models = useStore((state) => state.models);
  const state = useStore((state) => state.state);
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

  useFrame((_, delta) => {
    const target = -xW * index;
    damp(group.current!.position, "x", target, 0.2, delta);
  });

  return (
    <group ref={group}>
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
  const selectedModel = useStore((state) => state.selectedModel);

  const notSelected = selectedModel === null;
  return (
    <div
      style={{
        transition: "all 0.5s",
        opacity: notSelected ? 1 : 0,
        transform: `scale(${notSelected ? 1 : 0.25})`
      }}
    >
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 space-x-4 sm:bottom-8">
        <button
          className="drounded-xl bg-black p-1.5 text-white backdrop-blur-xl transition-transform hover:scale-110"
          onClick={() => previous()}
        >
          <Icon name="chevron-up" className="sm:h7 sm:w7 h-6 w-6 -rotate-90" />
        </button>
        <button
          className="drounded-xl bg-black p-1.5 text-white backdrop-blur-xl transition-transform hover:scale-110"
          onClick={() => next()}
        >
          <Icon name="chevron-up" className="sm:h7 sm:w7 h-6 w-6 rotate-90" />
        </button>
      </div>
    </div>
  );
};

const Experience = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Mesh | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const state = useStore((state) => state.state);
  const { height } = useThree((state) => state.viewport);
  const isOpen = state === "open";

  useFrame((_, delta) => {
    if (state === "open") {
      damp3(groupRef.current!.position, [0, 0, 2.5], 0.1, delta);
    }
  });

  return (
    <group ref={groupRef} position={[0, -height, 0]}>
      {children}
    </group>
  );
};

export default function News() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
        <>
          <Canvas>
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
            {/* <CameraRig /> */}
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
        </>
      )}
    </ClientOnly>
  );
}
