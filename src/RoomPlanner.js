import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, TransformControls } from '@react-three/drei';
import useModelData from './useModelData'; // Ensure the path is correct
import ModelSelector from './ModelSelector'; // Ensure the path is correct

const DraggableModel = ({ url, scale }) => {
  const { scene } = useGLTF(url, true); // Load the model, ensure correct url handling
  const modelRef = React.useRef();
  const controlsRef = React.useRef();

  React.useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
  }, [modelRef, controlsRef]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale} // Apply dynamic scale
      />
      <TransformControls
        ref={controlsRef}
        object={modelRef.current}
        mode="translate"
      />
    </>
  );
};

const Room = () => {
  const floorTexture = useTexture('/wood.jpg');
  const wallTexture = useTexture('/texture-2068283.jpg');

  return (
    <>
      {/* Room Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Back Wall */}
      <mesh receiveShadow position={[0, 12.5, -25]}>
        <boxGeometry args={[50, 25, 1]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Left Wall */}
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-25, 12.5, 0]}>
        <boxGeometry args={[50, 25, 1]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Right Wall */}
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[25, 12.5, 0]}>
        <boxGeometry args={[50, 25, 1]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Ceiling */}
      <mesh receiveShadow rotation={[Math.PI, 0, 0]} position={[0, 25, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
    </>
  );
};

const RoomPlanner = () => {
  const modelData = useModelData();
  const [selectedModel, setSelectedModel] = useState(null);
  const [scale, setScale] = useState([1, 1, 1]); // State for model scale
  const [isLoading, setIsLoading] = useState(false); // State for loading dialog

  const handleModelSelect = (model) => {
    setIsLoading(true); // Show loading dialog
    setSelectedModel(model);
  };

  const handleModelLoad = () => {
    setIsLoading(false); // Hide loading dialog once model is loaded
  };

  const increaseSize = () => {
    setScale((prev) => prev.map((s) => s + 0.1));
  };

  const decreaseSize = () => {
    setScale((prev) => prev.map((s) => Math.max(s - 0.1, 0.1))); // Prevent size going below 0.1
  };

  return (
    <div className="flex">
      <div className="w-64 p-4 bg-gray-100 border-r border-gray-300">
        <ModelSelector models={modelData} onModelSelect={handleModelSelect} />
        <div className="mt-4">
          <button onClick={increaseSize} className="block w-full p-2 bg-blue-500 text-white mb-2">
            Increase Size
          </button>
          <button onClick={decreaseSize} className="block w-full p-2 bg-red-500 text-white">
            Decrease Size
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-10">
            <div className="p-4 bg-white rounded">Loading model...</div>
          </div>
        )}
        <Canvas
          shadows
          camera={{ position: [0, 31.5, 50], fov: 60 }}
          className="w-full h-screen bg-light-gray"
          style={{ width: '100%', height: '800px', backgroundColor: 'lightgray' }}
        >
          <ambientLight intensity={1} />
          <spotLight position={[20, 40, 10]} angle={0.3} penumbra={0.5} castShadow />
          <spotLight position={[-20, 40, 10]} angle={0.3} penumbra={0.5} castShadow />
          <Room />
          {selectedModel && (
            <DraggableModel url={selectedModel} scale={scale} onLoad={handleModelLoad} />
          )}
          <OrbitControls enableRotate={false} />
        </Canvas>
      </div>
    </div>
  );
};

export default RoomPlanner;
