import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  MeshReflectorMaterial,
  BakeShadows,
  FirstPersonControls,
  OrbitControls,
  PerformanceMonitor,
  Lightformer,
  Environment
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField
} from "@react-three/postprocessing";
import { easing } from "maath";
import { Instances, Computers } from "./Computers";
import { ClientOnly } from "remix-utils/client-only";
import { useRef, useState } from "react";
import { Perf } from "r3f-perf";
import { Smol } from "./Smol";
import { Color } from "three";

function Env() {
  const ref = useRef<THREE.Group | null>(null);
  useFrame((state, delta) => {
    easing.damp3(
      ref.current!.rotation as unknown as THREE.Vector3,
      [Math.PI / 2, 0, state.clock.elapsedTime / 5 + state.pointer.x],
      0.2,
      delta
    );
    easing.damp3(
      state.camera.position,
      [
        Math.sin(state.pointer.x / 4) * 9,
        1.25 + state.pointer.y,
        Math.cos(state.pointer.x / 4) * 9
      ],
      0.5,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <Environment
      frames={Infinity}
      preset="city"
      resolution={256}
      background
      blur={0.8}
    >
      <Lightformer
        intensity={4}
        rotation-x={Math.PI / 2}
        position={[0, 5, -9]}
        scale={[10, 10, 1]}
      />
      <Lightformer
        intensity={4}
        rotation-x={Math.PI / 2}
        position={[0, 5, -9]}
        scale={[10, 10, 1]}
      />
      <group rotation={[Math.PI / 2, 1, 0]}>
        {[2, -2, 2, -4, 2, -5, 2, -9].map((x, i) => (
          <Lightformer
            key={i}
            intensity={1}
            rotation={[Math.PI / 4, 0, 0]}
            position={[x, 4, i * 4]}
            scale={[4, 1, 1]}
          />
        ))}
        <Lightformer
          intensity={0.5}
          rotation-y={Math.PI / 2}
          position={[-5, 1, -1]}
          scale={[50, 2, 1]}
        />
        <Lightformer
          intensity={0.5}
          rotation-y={Math.PI / 2}
          position={[-5, -1, -1]}
          scale={[50, 2, 1]}
        />
        <Lightformer
          intensity={0.5}
          rotation-y={-Math.PI / 2}
          position={[10, 1, 0]}
          scale={[50, 2, 1]}
        />
      </group>
      <group ref={ref}>
        <Lightformer
          intensity={5}
          form="ring"
          color="red"
          rotation-y={Math.PI / 2}
          position={[-5, 2, -1]}
          scale={[10, 10, 1]}
        />
      </group>
    </Environment>
  );
}

export default function Tv() {
  const [perfSucks, degrade] = useState(false);
  const bgColor = new Color(0x0e072d);

  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
        <Canvas
          shadows
          dpr={[1, perfSucks ? 1.5 : 2]}
          camera={{ position: [0, 0, 1], fov: 45, near: 1, far: 20 }}
          eventSource={document.getElementById("root")!}
          eventPrefix="client"
        >
          <Perf />
          <PerformanceMonitor onDecline={() => degrade(true)} />
          {/* Lights */}
          <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
          <hemisphereLight intensity={0.15} groundColor={bgColor} />
          <spotLight
            position={[10, 20, 10]}
            angle={0.12}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={1024}
          />
          {/* Main scene */}
          <group position={[-0, -1, 0]}>
            {/* Auto-instanced sketchfab model */}
            <Instances>
              <Computers scale={0.5} />
            </Instances>
            <Smol
              scale={0.03}
              position={[0, 0, 3]}
              rotation={[0, Math.PI, 0]}
            />
            {/* Plane reflections + distance blur */}
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
                color="#202020"
                metalness={0.8}
              />
            </mesh>
            {/* Bunny and a light give it more realism */}

            <pointLight
              distance={1.5}
              intensity={1}
              position={[-0.15, 0.7, 0]}
              color="orange"
            />
          </group>
          {/* Postprocessing */}
          <EffectComposer disableNormalPass>
            <Bloom
              luminanceThreshold={0}
              mipmapBlur
              luminanceSmoothing={0.0}
              intensity={2}
            />
            <DepthOfField
              target={[0, 0, 2]}
              focalLength={0.3}
              bokehScale={10}
              height={700}
            />
          </EffectComposer>
          {/* Camera movements */}
          {/* <CameraRig /> */}
          <OrbitControls
            enableZoom={false}
            // vertical movement limit
            minPolarAngle={Math.PI / 2}
            // horizontal movement limit
            minAzimuthAngle={-Math.PI / 2}
          />
          {/* Small helper that freezes the shadows for better performance */}
          <BakeShadows />
        </Canvas>
      )}
    </ClientOnly>
  );
}
