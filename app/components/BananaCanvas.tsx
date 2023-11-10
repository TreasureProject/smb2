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
import { useKonami } from "~/contexts/konami";
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
  const { nodes, materials } = useGLTF("/banana-transformed.glb") as GLTFResult;
  const ref = React.useRef<THREE.Group | null>(null);
  const { viewport, camera } = useThree();

  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);
  const { activated } = useKonami();

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

  useFrame(() => {
    ref.current?.rotation.set(
      (position.rX += 0.001),
      (position.rY += 0.001),
      (position.rZ += 0.001)
    );
    ref.current?.position.set(
      position.x * width,
      (position.y += activated ? 0.1 : 0.005),
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

  return (
    <mesh position={[0, 0, -50]}>
      <planeGeometry args={[128, 72]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export const BananaCanvas = ({ count = 200, depth = 80 }) => {
  const location = useLocation();
  const { activated } = useKonami();
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
      dpr={[1, 1.5]}
      className={cn(notHome && "hidden", activated && "z-20")}
    >
      <color attach="background" args={["#000000"]} />

      <hemisphereLight
        ref={ref}
        intensity={0.5}
        groundColor={new THREE.Color(0x0e072d)}
      />
      <Selection>
        <Suspense>
          <Select enabled={false}>
            <Background />
          </Select>
          <Select enabled>
            {Array.from({ length: count }).map((_, i) => (
              <Banana key={i} z={(-i / count) * depth - 20} />
            ))}
          </Select>
        </Suspense>
        <EffectComposer multisampling={0}>
          <SelectiveBloom
            lights={[ref]}
            luminanceThreshold={0}
            mipmapBlur
            luminanceSmoothing={0.2}
            intensity={40}
          />
        </EffectComposer>
      </Selection>
    </Canvas>
  );
};
