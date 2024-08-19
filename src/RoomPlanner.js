import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import useModelData from './useModelData'; // Ensure the path is correct
import ModelSelector from './ModelSelector'; // Ensure the path is correct
import DraggableModel from './DraggableModel'; // Ensure the path is correct


const Room = () => {
  const floorTexture = useTexture('/floor.jpg');
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
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null); // Track the selected model
  const [isLoading, setIsLoading] = useState(false); // State for loading dialog
  const [rotationAngle, setRotationAngle] = useState(0); // Rotation angle for selected model

  const handleModelSelect = (model) => {
    setIsLoading(true); // Show loading dialog
    const newModel = { url: model, id: Date.now(), scale: [2, 2, 2], rotation: 0 }; // Default scale and rotation
    setSelectedModels([...selectedModels, newModel]); // Add model to the list
    setSelectedModelId(newModel.id); // Automatically select the newly added model
  };

  const handleModelLoad = () => {
    setIsLoading(false); // Hide loading dialog once model is loaded
  };

  const increaseSize = () => {
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, scale: model.scale.map(s => s + 0.1) } : model
      )
    );
  };

  const decreaseSize = () => {
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, scale: model.scale.map(s => Math.max(s - 0.1, 0.1)) } : model
      )
    );
  };

  const handleRotationChange = (event) => {
    const newAngle = parseFloat(event.target.value);
    setRotationAngle(newAngle);
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, rotation: newAngle } : model
      )
    );
  };

  const resetScene = () => {
    setSelectedModels([]); // Clear all models
    setSelectedModelId(null); // Reset selected model
  };

  const handleModelClick = (id) => {
    setSelectedModelId(id); // Set the clicked model as selected
  };

  return (
    <div className="flex">
      <div className="w-64 p-4 bg-gray-100 border-r border-gray-300">
        <ModelSelector models={modelData} onModelSelect={handleModelSelect} />
        <div className="mt-4">
          <button onClick={increaseSize} className="block w-full p-2 bg-blue-500 text-white mb-2">
            Increase Size
          </button>
          <button onClick={decreaseSize} className="block w-full p-2 bg-red-500 text-white mb-2">
            Decrease Size
          </button>
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-gray-700">Rotation (degrees):</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={handleRotationChange}
              className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              style={{ backgroundSize: `${rotationAngle}% 100%` }} // Stylish slider
            />
            <div className="text-center text-gray-700">{rotationAngle}°</div>
          </div>
          <button onClick={resetScene} className="block w-full p-2 bg-gray-500 text-white mt-2">
            Reset Scene
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-10">
          <div>
          <dotlottie-player
                src="https://lottie.host/26a21a33-0f06-4040-8569-fdd95203dcfc/9N0zcfkBrF.json"
                background="transparent"
                speed="1"
                style={{ width: '300px', height: '300px' }}
                loop
                autoplay
              ></dotlottie-player>
            </div>
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
          {selectedModels.map((model) => (
            <DraggableModel
              key={model.id}
              url={model.url}
              scale={model.scale}
              rotation={model.rotation}
              onLoad={handleModelLoad}
              onClick={() => handleModelClick(model.id)} // Select model on click
              isSelected={model.id === selectedModelId} // Highlight selected model
            />
          ))}
          <OrbitControls enableRotate={false} />
        </Canvas>
      </div>
    </div>
  );
};

export default RoomPlanner;
