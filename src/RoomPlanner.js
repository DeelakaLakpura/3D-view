import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import useModelData from './useModelData'; // Ensure the path is correct
import ModelSelector from './ModelSelector'; // Ensure the path is correct
import DraggableModel from './DraggableModel'; // Ensure the path is correct

const RoomPlanner = () => {
  const modelData = useModelData();
  const [selectedModels, setSelectedModels] = useState([]);
  const [modelHistory, setModelHistory] = useState([]); // For undo functionality
  const [selectedModelId, setSelectedModelId] = useState(null); // Track the selected model
  const [rotationAngle, setRotationAngle] = useState(0); // Rotation angle for selected model

  const handleModelSelect = (model) => {
    const newModel = { url: model, id: Date.now(), scale: [2, 2, 2], rotation: 0 };
    const updatedModels = [...selectedModels, newModel];
    setModelHistory([...modelHistory, selectedModels]); // Save the current state to history
    setSelectedModels(updatedModels);
    setSelectedModelId(newModel.id);
  };

  const handleModelLoad = () => {
    // Hide loading dialog once model is loaded
  };

  const increaseSize = () => {
    setModelHistory([...modelHistory, selectedModels]); // Save the current state to history
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, scale: model.scale.map(s => s + 1) } : model
      )
    );
  };

  const decreaseSize = () => {
    setModelHistory([...modelHistory, selectedModels]); // Save the current state to history
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, scale: model.scale.map(s => Math.max(s - 1, 1)) } : model
      )
    );
  };

  const handleRotationChange = (event) => {
    const newAngle = parseFloat(event.target.value);
    setRotationAngle(newAngle);
    setModelHistory([...modelHistory, selectedModels]); // Save the current state to history
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId ? { ...model, rotation: newAngle } : model
      )
    );
  };

  const resetScene = () => {
    setModelHistory([...modelHistory, selectedModels]); // Save the current state to history
    setSelectedModels([]);
    setSelectedModelId(null);
  };

  const undo = () => {
    const previousModels = modelHistory.pop(); // Get the last state
    if (previousModels) {
      setSelectedModels(previousModels);
      setModelHistory([...modelHistory]); // Update history
    }
  };

  const handleModelClick = (id) => {
    setSelectedModelId(id);
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
              style={{ backgroundSize: `${rotationAngle}% 100%` }}
            />
            <div className="text-center text-gray-700">{rotationAngle}°</div>
          </div>
          <button onClick={resetScene} className="block w-full p-2 bg-gray-500 text-white mt-2">
            Reset Scene
          </button>
          <button onClick={undo} className="block w-full p-2 bg-yellow-500 text-white mt-2">
            Undo
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <Canvas
          shadows
          camera={{ position: [0, 31.5, 50], fov: 60 }}
          className="w-full h-screen bg-light-gray"
          style={{ width: '100%', height: '800px', backgroundColor: 'lightgray' }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
          <directionalLight position={[-10, 10, 5]} intensity={1.5} castShadow />
          <RoomPlanner />
          {selectedModels.map((model) => (
            <DraggableModel
              key={model.id}
              url={model.url}
              scale={model.scale}
              rotation={model.rotation}
              onLoad={handleModelLoad}
              onClick={() => handleModelClick(model.id)}
              isSelected={model.id === selectedModelId}
            />
          ))}
          <OrbitControls enableRotate={false} />
        </Canvas>
      </div>
    </div>
  );
};

export default RoomPlanner;
