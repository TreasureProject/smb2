import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useLocation } from "@remix-run/react";

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
    ref.current?.position.set(position.x * width, (position.y += 0.025), z);

    if (position.y > height / 1.25) {
      position.y = -height / 1.25;
    }
  });

  return (
    <group ref={ref} {...props} dispose={null} scale={0.2}>
      <mesh geometry={nodes.banana.geometry} material={materials.skin} />
    </group>
  );
}

useGLTF.preload("/banana-transformed.glb");

export const BananaCanvas = ({ count = 200, depth = 80 }) => {
  const location = useLocation();

  return (
    <Canvas
      legacy={true}
      frameloop={location.pathname !== "/" ? "never" : "always"}
      gl={{ alpha: false }}
      camera={{
        near: 0.01,
        far: 110,
        fov: 30
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#1938F2"]} />
      <spotLight position={[10, 10, 10]} intensity={1} />
      <Suspense>
        {Array.from({ length: count }).map((_, i) => (
          <Banana key={i} z={(-i / count) * depth - 20} />
        ))}
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
};
