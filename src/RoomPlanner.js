import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import useModelData from './useModelData';
import ModelSelector from './ModelSelector';
import DraggableModel from './DraggableModel';
import { Dialog } from '@headlessui/react'; // Import Headless UI for dialog

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

 

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="relative h-screen w-screen flex">
      {/* Sidebar Toggle Button */}
      <button
        className={`absolute top-4 left-4 z-10 p-2 bg-gray-600 text-white rounded-full ${isSidebarOpen ? 'hidden' : 'block'}`}
        onClick={() => setIsSidebarOpen(true)}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
      
      {/* Sidebar */}
      <div className={`w-full lg:w-64 p-4 bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-300 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-gray-600 text-white rounded-full lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
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
      
      <div className="flex-1 relative">
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

        {/* Product Dialog */}
        <Dialog open={isDialogOpen} onClose={closeDialog} className="relative z-20">
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Dialog.Panel className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900">Product List</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-500">
                Select a product to add to the room.
              </Dialog.Description>
              <ul className="mt-4 space-y-2">
                {modelData.map((model) => (
                  <li
                    key={model.id}
                    className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      handleModelSelect(model.url);
                      closeDialog();
                    }}
                  >
                    {model.name}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default RoomPlanner;
