import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import useModelData from './useModelData'; // Ensure the path is correct
import ModelSelector from './ModelSelector'; // Ensure the path is correct
import DraggableModel from './DraggableModel'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faArrowUp } from '@fortawesome/free-solid-svg-icons';

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
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleModelSelect = (model) => {
    const newModel = { url: model, id: Date.now(), scale: [2, 2, 2], rotation: [0, 0, 0] };
    setSelectedModels([...selectedModels, newModel]);
    setSelectedModelId(newModel.id);
  };

  const increaseSize = () => {
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, scale: model.scale.map((s) => s + 1) } : model
      )
    );
  };

  const decreaseSize = () => {
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, scale: model.scale.map((s) => Math.max(s - 1, 1)) } : model
      )
    );
  };

  const handleRotationChange = (event) => {
    const newAngle = parseFloat(event.target.value);
    setRotationAngle(newAngle);
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, rotation: [0, newAngle * (Math.PI / 180), 0] } : model
      )
    );
  };

  const resetScene = () => {
    setSelectedModels([]);
    setSelectedModelId(null);
  };

  const handleModelClick = (id) => {
    setSelectedModelId(id);
  };

  const bringToFront = () => {
    if (selectedModelId) {
      setSelectedModels((prevModels) => {
        const selectedModelIndex = prevModels.findIndex((model) => model.id === selectedModelId);
        if (selectedModelIndex !== -1) {
          const updatedModels = [...prevModels];
          const [selectedModel] = updatedModels.splice(selectedModelIndex, 1);
          updatedModels.push(selectedModel);
          return updatedModels;
        }
        return prevModels;
      });
    }
  };

  return (
    <div className="relative h-screen flex">
      {/* Sidebar */}
      <div
        className={`absolute z-10 lg:static bg-gray-100 transition-transform transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 lg:w-80 h-full p-4 overflow-y-auto border-r border-gray-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 bg-gray-500 text-white rounded-full"
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
          </button>
          <button
            onClick={bringToFront}
            className="p-2 bg-blue-500 text-white rounded-full ml-auto"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>

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
              style={{ backgroundSize: `${rotationAngle}% 100%` }}
            />
            <div className="text-center text-gray-700">{rotationAngle}°</div>
          </div>
          <button onClick={resetScene} className="block w-full p-2 bg-gray-500 text-white mt-2">
            Reset Scene
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1">
        <Canvas
          shadows
          camera={{ position: [0, 31.5, 50], fov: 60 }}
          className="w-full h-full bg-light-gray"
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
              onClick={() => handleModelClick(model.id)}
              isSelected={model.id === selectedModelId}
            />
          ))}
          <OrbitControls enableRotate={false} />
        </Canvas>
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 p-2 bg-gray-500 text-white rounded-full z-20"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
        {!isSidebarOpen && (
          <button
            onClick={bringToFront}
            className="absolute top-16 left-4 p-2 bg-blue-500 text-white rounded-full z-20"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomPlanner;
