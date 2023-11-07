import { AnimationContainer } from "~/components/AnimationContainer";
import CarVid from "./car.mp4";
import Smol from "./smol.png";
import { ClientOnly } from "remix-utils/client-only";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  Scroll,
  ScrollControls,
  useTexture
} from "@react-three/drei";

const Newspaper = (props) => {
  const texture = useTexture("img/Newspaper.webp");
  const ref = useRef();
  const controls = useThree((state) => state.controls);

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

  useEffect(() => {
    if (clicked) {
      controls?.fitToBox(ref.current, true, {
        paddingLeft: 0.05,
        paddingRight: 0.05,
        paddingBottom: 0.05,
        paddingTop: 0.05
      });
    } else {
      controls?.reset(true);
    }
  }, [clicked]);

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={() => setClicked((clicked) => !clicked)}
    >
      <planeGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Scroller = ({ w = 2, gap = 0.15, ...props }) => {
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  return (
    <ScrollControls
      pages={(width - xW + 8 * xW) / width}
      damping={0.1}
      horizontal={true}
    >
      <Scroll>
        {[...new Array(8).fill(undefined)].map((_, i) => (
          <Newspaper
            key={i}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[w, 2, 1]}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
};

export default function News() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
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
      )}
    </ClientOnly>
  );
}
