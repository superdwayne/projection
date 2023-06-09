import * as THREE from "three";
import { CameraHelper } from "three";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { softShadows, OrbitControls, useHelper } from "@react-three/drei";
import "./project";
import { useGLTF } from '@react-three/drei'


function Sky() {
  const texture = new THREE.TextureLoader().load("2k_stars_milky_way.jpg");
  return (
    <mesh position={[0.0, 0.0, 0.0]}>
      <sphereBufferGeometry args={[100, 30, 30]} attach="geometry" />
      <meshBasicMaterial side={2} map={texture} attach="material" />
    </mesh>
  );
}

function Earth() {
  const texture = new THREE.TextureLoader().load("2k_earth_nightmap.jpg");
  return (
    <mesh position={[0.0, 0.0, 0.0]}>
      <sphereBufferGeometry args={[1, 30, 30]} attach="geometry" />
      <meshPhongMaterial side={2} map={texture} attach="material" />
    </mesh>
  );
}

function Project() {
  const shaderMat = useRef();
  const camera = useRef();
  // preload the texture
  const texture = new THREE.TextureLoader().load("Circle.png");
  // create the mesh with the projected material
  const color = 0x223d54;
  const boxGeo = useRef();
  useFrame((state, delta) => {
    camera.current.lookAt(0, 0, 0);
    camera.current.updateProjectionMatrix();
    camera.current.updateMatrixWorld();
    camera.current.updateWorldMatrix();
    shaderMat.current.viewMatrixCamera = camera.current.matrixWorldInverse.clone();
    shaderMat.current.projectionMatrixCamera = camera.current.projectionMatrix.clone();
    shaderMat.current.modelMatrixCamera = camera.current.matrixWorld.clone();
    shaderMat.current.projPosition = camera.current.position.clone();
    // boxGeo.current.rotation.z += 0.01;
  });
  const color_ = new THREE.Color(color);
  useHelper(camera, CameraHelper, "cyan");

  const { nodes, materials } = useGLTF('/left.glb')

  return (
    <>
      <perspectiveCamera position={[1.0, 0.0, 0.0]} pov={20} ref={camera} />

      <mesh geometry={nodes.id_Punta.geometry} material={materials.Default} position={[-1.78, -0.5, 0]} rotation={[-Math.PI, 0.01, -Math.PI]} scale={10}>

        {/* <boxBufferGeometry args={[2, 10, 10]} attach="geometry" /> */}
        <projectedMaterial
          ref={shaderMat}
          attach="material"
          textture={texture}
          color={color_}
        />
      </mesh>
    </>
  );
}

function App() {
  return (
    <Canvas
      style={{ width: `100vw`, height: `100vh` }}
      shadowMap
      camera={{ position: [0, 10, 0], fov: 50 }}
    >
      <OrbitControls />
      <ambientLight intensity={1.6} />
      <Sky />
      <directionalLight castShadow intensity={1.5} shadow-camera-far={50} />
     
      <Project />
    </Canvas>
  );
}

export default App;
