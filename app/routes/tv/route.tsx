import { Canvas } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  BakeShadows,
  PerformanceMonitor,
  FirstPersonControls,
  Environment,
  OrbitControls
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField
} from "@react-three/postprocessing";
import { Instances, Computers } from "./Computers";
import { ClientOnly } from "remix-utils/client-only";
import { useState } from "react";
import { Smol } from "./Smol";
import { Color } from "three";
import { Link } from "@remix-run/react";

import { commonMeta } from "~/seo";
import { Icon } from "~/components/Icons";
import { Header } from "~/components/Header";

export const meta = commonMeta;

export default function Tv() {
  const [perfSucks, degrade] = useState(false);
  const bgColor = new Color(0x0e072d);

  return (
    <div className="flex h-full flex-col">
      <Header name="TV" />
      <ClientOnly
        fallback={
          <div className="grid h-full place-items-center text-white font-mono text-lg">
            Loading...
          </div>
        }
      >
        {() => (
          <Canvas
            className="canvas flex-1"
            shadows
            dpr={[1, perfSucks ? 1.5 : 2]}
            camera={{ position: [0, 0, 1], fov: 45, near: 1, far: 20 }}
            eventSource={document.getElementById("root")!}
            eventPrefix="client"
          >
            <PerformanceMonitor onDecline={() => degrade(true)} />
            <Environment preset="night" />
            <hemisphereLight intensity={0.15} groundColor={bgColor} />
            <spotLight
              position={[10, 20, 10]}
              angle={0.12}
              penumbra={1}
              intensity={1}
              castShadow
              shadow-mapSize={1024}
            />
            <group position={[-0, -1, 0]}>
              <Instances>
                <Computers scale={0.5} />
              </Instances>
              <Smol
                rotation={[0, Math.PI, 0]}
                scale={0.03}
                position={[0, 0, 3]}
              />
              <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                  mirror={0}
                  blur={[300, 30]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={80}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#0E072D"
                  metalness={0.8}
                />
              </mesh>

              <pointLight
                distance={1.5}
                intensity={1}
                position={[-0.15, 0.7, 0]}
                color="orange"
              />
            </group>
            <EffectComposer disableNormalPass>
              <Bloom
                luminanceThreshold={0}
                mipmapBlur
                luminanceSmoothing={0.0}
                intensity={2}
              />
            </EffectComposer>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2}
              minAzimuthAngle={-Math.PI / 2}
              minDistance={1} // Set your desired minimum distance
            />
            <BakeShadows />
          </Canvas>
        )}
      </ClientOnly>
    </div>
  );
}
