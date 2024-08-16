import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper, useGLTF } from "@react-three/drei";
import { CameraHelper } from "three";
import './App.css'

function Sky() {
  const texture = new THREE.TextureLoader().load("/2k_stars_milky_way.jpg");
  return (
    <mesh position={[0.0, 0.0, 0.0]}>
      <sphereBufferGeometry args={[100, 30, 30]} attach="geometry" />
      <meshBasicMaterial side={THREE.BackSide} map={texture} attach="material" />
    </mesh>
  );
}

function Project() {
  const shaderMat = useRef();
  const camera = useRef();
  const meshRef = useRef();
  const { nodes, materials } = useGLTF('/nike.glb');

  // Video texture
  const video = document.getElementById('videoTexture');
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBAFormat; // Updated format

  // Handle image upload and apply to mesh
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;

      const uploadedTexture = new THREE.Texture(img);
      uploadedTexture.needsUpdate = true;

      img.onload = function () {
        uploadedTexture.needsUpdate = true;
      };

      // Apply uploadedTexture to the mesh
      if (meshRef.current) {
        meshRef.current.material.map = uploadedTexture;
        meshRef.current.material.needsUpdate = true;
      }
    };

    reader.readAsDataURL(file);
  };

  useFrame(() => {
    if (camera.current) {
      camera.current.lookAt(0, 0, 0);
      camera.current.updateProjectionMatrix();
      camera.current.updateMatrixWorld();
      camera.current.updateWorldMatrix();
    }
    if (shaderMat.current) {
      shaderMat.current.viewMatrixCamera = camera.current.matrixWorldInverse.clone();
      shaderMat.current.projectionMatrixCamera = camera.current.projectionMatrix.clone();
      shaderMat.current.modelMatrixCamera = camera.current.matrixWorld.clone();
      shaderMat.current.projPosition = camera.current.position.clone();
    }
  });

  useHelper(camera, CameraHelper, "cyan");

  useEffect(() => {
    const uploadInput = document.getElementById('imageUpload');
    uploadInput.addEventListener('change', handleImageUpload);

    return () => {
      uploadInput.removeEventListener('change', handleImageUpload);
    };
  }, []);

  return (
    <>
      <perspectiveCamera position={[0, -1.0, -4.0]} fov={120} ref={camera} />
      <mesh
        ref={meshRef}
        geometry={nodes.Object_26.geometry}
        material={materials.Main}
        position={[-0, 0.675, 1.193]}
        rotation={[1.6, -0.914, 1.601]}
        scale={0.5}
      >
        <meshBasicMaterial map={videoTexture} />
      </mesh>
    </>
  );
}


function App() {
  return (
    <Canvas
      style={{ width: `99vw`, height: `99vh` }}
      shadowMap
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      <OrbitControls />
      <Sky />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, 5, -5]} intensity={0.7} />
      <Project />
    </Canvas>
  );
}

export default App;
