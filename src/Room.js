import React from 'react';
import { useTexture } from '@react-three/drei';

const Room = ({ floorTextureUrl, wallTextureUrl, floorWidth, floorHeight, wallWidth, wallHeight }) => {
  const floorTexture = useTexture(floorTextureUrl);
  const wallTexture = useTexture(wallTextureUrl);

  return (
    <>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[floorWidth, floorHeight]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Back Wall */}
      <mesh receiveShadow position={[0, wallHeight / 2, -floorWidth / 2]}>
        <boxGeometry args={[floorWidth, wallHeight, 1]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Left Wall */}
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-floorWidth / 2, wallHeight / 2, 0]}>
        <boxGeometry args={[floorHeight, wallHeight, 1]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Right Wall */}
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[floorWidth / 2, wallHeight / 2, 0]}>
        <boxGeometry args={[floorHeight, wallHeight, 1]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Ceiling */}
      <mesh receiveShadow rotation={[Math.PI, 0, 0]} position={[0, floorHeight / 2, 0]}>
        <planeGeometry args={[floorWidth, floorHeight]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>

      {/* Advanced Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 20, 10]} intensity={1.5} color="white" />
      <spotLight position={[0, 30, 0]} angle={0.5} penumbra={1} intensity={2} color="white" />
      <hemisphereLight skyColor="skyblue" groundColor="darkslategray" intensity={0.5} />

      {/* Decorative Elements */}
      {/* Columns with ornate details */}
      <mesh receiveShadow position={[-floorWidth / 2 + 1, wallHeight / 2, -floorWidth / 2 + 1]}>
        <cylinderGeometry args={[1, 1, 10, 32]} />
        <meshStandardMaterial color="gold" />
      </mesh>

      <mesh receiveShadow position={[floorWidth / 2 - 1, wallHeight / 2, -floorWidth / 2 + 1]}>
        <cylinderGeometry args={[1, 1, 10, 32]} />
        <meshStandardMaterial color="gold" />
      </mesh>

      {/* Wall Art */}
      <mesh position={[0, wallHeight / 2 + 1, -floorWidth / 2 + 1]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Ceiling Patterns */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, floorHeight / 2, 0]}>
        <planeGeometry args={[floorWidth, floorHeight]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
    </>
  );
};

export default Room;
