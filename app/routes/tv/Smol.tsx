/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 smol.glb --transform --instance --types 
Files: smol.glb [136.2KB] > smol-transformed.glb [88.82KB] (35%)
*/

import type * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    立方体7268: THREE.Mesh;
    立方体7268_1: THREE.Mesh;
    立方体7268_2: THREE.Mesh;
  };
  materials: {
    ["Voxel_mat249.001"]: THREE.MeshStandardMaterial;
    ["Voxel_mat251.001"]: THREE.MeshStandardMaterial;
    ["Voxel_mat250.001"]: THREE.MeshStandardMaterial;
  };
};

export function Smol(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/smol-transformed.glb") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.立方体7268.geometry}
        material={materials["Voxel_mat249.001"]}
      />
      <mesh
        geometry={nodes.立方体7268_1.geometry}
        material={materials["Voxel_mat251.001"]}
      />
      <mesh
        geometry={nodes.立方体7268_2.geometry}
        material={materials["Voxel_mat250.001"]}
      />
    </group>
  );
}

useGLTF.preload("/smol-transformed.glb");
