/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 mailbox.glb --transform --keepmeshes --types 
Files: mailbox.glb [6.4MB] > mailbox-transformed.glb [308.24KB] (95%)
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { Center, useCursor, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import { damp3, dampE, dampQ } from "maath/easing";
import useStore from "./store";

type GLTFResult = GLTF & {
  nodes: {
    Body: THREE.Mesh;
    Door_1: THREE.Mesh;
    Door_2: THREE.Mesh;
  };
  materials: {
    NewspaperVendingMachine_Body: THREE.MeshStandardMaterial;
    NewspaperVendingMachine_Glass: THREE.MeshStandardMaterial;
  };
};

export function Mailbox(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/mailbox-transformed.glb"
  ) as GLTFResult;
  const [clicked, setClicked] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  useCursor(hovered);
  const ref = useRef<THREE.Group | null>(null);
  const { width } = useThree((state) => state.viewport);
  const centerRef = useRef<THREE.Group | null>(null);
  const setState = useStore((state) => state.setState);
  const state = useStore((state) => state.state);
  useFrame((_, delta) => {
    if (clicked) {
      dampE(ref.current!.rotation, new THREE.Euler(1, 0, 0), 0.1, delta);
    }

    if (state === "open") {
      damp3(centerRef.current!.position, [-width / 2, -0.34, 4], 2, delta);
    }
  });
  return (
    <Center position={[0, -0.34, 4]} ref={centerRef}>
      <group
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => {
          setClicked(true);
          setTimeout(() => {
            setState("open");
          }, 1000);
        }}
        {...props}
        dispose={null}
        rotation={[0, 1, 0]}
      >
        <mesh
          geometry={nodes.Body.geometry}
          material={materials.NewspaperVendingMachine_Body}
          position={[0, -0.003, 0]}
          scale={0.01}
        />
        <group position={[-0.069, 0.804, 0.218]} scale={0.01} ref={ref}>
          <mesh
            geometry={nodes.Door_1.geometry}
            material={materials.NewspaperVendingMachine_Body}
          />
          <mesh
            geometry={nodes.Door_2.geometry}
            material={materials.NewspaperVendingMachine_Glass}
          />
        </group>
      </group>
    </Center>
  );
}

useGLTF.preload("/mailbox-transformed.glb");
