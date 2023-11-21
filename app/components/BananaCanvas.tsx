import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useLocation } from "@remix-run/react";
import {
  EffectComposer,
  Select,
  Selection,
  SelectiveBloom
} from "@react-three/postprocessing";
import { useEasterEgg } from "~/contexts/easteregg";
import { cn } from "~/utils";

interface GLTFResult extends GLTF {
  nodes: {
    banana: THREE.Mesh;
  };
  materials: {
    skin: THREE.MeshStandardMaterial;
  };
}

function Banana({
  z,
  ...props
}: {
  z: number;
} & JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/banana-transformed.glb") as GLTFResult;
  const ref = React.useRef<THREE.Group | null>(null);
  const { viewport, camera } = useThree();

  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);
  const { konamiActivated } = useEasterEgg();

  const position = React.useMemo(
    () => ({
      x: THREE.MathUtils.randFloatSpread(2),
      y: THREE.MathUtils.randFloatSpread(height),
      rX: Math.random() * Math.PI,
      rY: Math.random() * Math.PI,
      rZ: Math.random() * Math.PI
    }),
    []
  );

  useFrame((state, delta) => {
    ref.current?.rotation.set(
      (position.rX += 0.001),
      (position.rY += 0.001),
      (position.rZ += 0.001)
    );
    // convert above to use delta
    ref.current?.rotation.set(
      (position.rX += konamiActivated ? delta * 3 : delta / 120),
      (position.rY += konamiActivated ? delta * 3 : delta / 120),
      (position.rZ += konamiActivated ? delta * 3 : delta / 120)
    );

    ref.current?.position.set(
      position.x * width,
      (position.y += konamiActivated ? delta * 10 : delta / 2),
      z
    );

    if (position.y > height / 1.25) {
      position.y = -height / 1.25;
    }
  });

  return (
    <group ref={ref} {...props} dispose={null} scale={0.1}>
      <mesh geometry={nodes.banana.geometry} material={nodes.banana.material} />
    </group>
  );
}

useGLTF.preload("/banana-transformed.glb");

// million-ignore
const Background = () => {
  const texture = useTexture("/img/stars.webp");
  const { viewport, camera } = useThree();
  const ref1 = React.useRef<THREE.Mesh | null>(null);
  const ref2 = React.useRef<THREE.Mesh | null>(null);

  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -102]);

  const { lofiActivated } = useEasterEgg();

  useFrame(() => {
    // endless background moving towards the left
    ref1.current?.position.set(
      (ref1.current.position.x -= lofiActivated ? 0.3 : 0.01),
      ref1.current.position.y,
      ref1.current.position.z
    );

    ref2.current?.position.set(
      (ref2.current.position.x -= lofiActivated ? 0.3 : 0.01),
      ref2.current.position.y,
      ref2.current.position.z
    );

    // reset background position to the right
    if (ref1.current!.position.x < -width) {
      ref1.current!.position.set(width, 0, -102);
    }

    if (ref2.current!.position.x < -width) {
      ref2.current!.position.set(width, 0, -102);
    }
  });

  return (
    <>
      <mesh ref={ref1} scale={[2.5, 2.5, 0]} position={[0, 0, -102]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <mesh ref={ref2} scale={[2.5, 2.5, 0]} position={[width, 0, -102]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};

export const BananaCanvas = ({ count = 200, depth = 80 }) => {
  const location = useLocation();
  const { konamiActivated } = useEasterEgg();
  const ref = React.useRef<THREE.HemisphereLight | null>(null);
  const notHome = location.pathname !== "/";
  return (
    <Canvas
      legacy
      frameloop={notHome ? "never" : "always"}
      camera={{
        near: 0.1,
        far: 110,
        fov: 30
      }}
      gl={{
        antialias: false
      }}
      style={{
        position: "absolute",
        inset: 0
      }}
      dpr={[1, 1.5]}
      className={cn(notHome && "hidden", konamiActivated && "z-20")}
    >
      <hemisphereLight
        ref={ref}
        intensity={0.5}
        groundColor={new THREE.Color(0x0e072d)}
      />
      <Selection>
        <Suspense>
          {!konamiActivated && (
            <Select enabled={false}>
              <Background />
            </Select>
          )}
          <Select enabled>
            {Array.from({ length: count }).map((_, i) => (
              <Banana key={i} z={(-i / count) * depth - 20} />
            ))}
          </Select>
        </Suspense>
        <EffectComposer multisampling={0}>
          <SelectiveBloom
            // @ts-ignore
            lights={[ref]}
            luminanceThreshold={0}
            mipmapBlur
            luminanceSmoothing={0.2}
            intensity={konamiActivated ? 5 : 40}
          />
        </EffectComposer>
      </Selection>
    </Canvas>
  );
};
