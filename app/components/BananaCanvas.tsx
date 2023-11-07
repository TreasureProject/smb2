import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useLocation } from "@remix-run/react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Glitch
} from "@react-three/postprocessing";
import { useKonami } from "~/contexts/konami";

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

export const BananaCanvas = ({ count = 200, depth = 80 }) => {
  const location = useLocation();
  const { activated } = useKonami();
  return (
    <Canvas
      legacy={true}
      frameloop={location.pathname !== "/" ? "never" : "always"}
      camera={{
        near: 0.01,
        far: 110,
        fov: 30
      }}
      dpr={[1, 1.5]}
      className={activated ? "z-20" : undefined}
    >
      <hemisphereLight
        intensity={0.5}
        groundColor={new THREE.Color(0x0e072d)}
      />
      <Suspense>
        {Array.from({ length: count }).map((_, i) => (
          <Banana key={i} z={(-i / count) * depth - 20} />
        ))}
      </Suspense>
      <Suspense fallback={null}>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            mipmapBlur
            luminanceSmoothing={0.2}
            intensity={40}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};
