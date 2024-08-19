import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import useModelData from './useModelData';
import DraggableModel from './DraggableModel';

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

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button onClick={increaseSize} className="p-2 bg-blue-500 text-white rounded">
          Increase Size
        </button>
        <button onClick={decreaseSize} className="p-2 bg-red-500 text-white rounded">
          Decrease Size
        </button>
        <button onClick={openDialog} className="p-2 bg-gray-500 text-white rounded">
          Product View
        </button>
        <button onClick={resetScene} className="p-2 bg-gray-700 text-white rounded">
          Reset Scene
        </button>
      </div>

      {/* Canvas for 3D Room */}
      <Canvas shadows camera={{ position: [0, 31.5, 50], fov: 60 }} className="w-full h-full">
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

      {/* Product View Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">Product List</h2>
            <div className="max-h-64 overflow-y-auto">
              {modelData.map((model) => (
                <div key={model} className="flex items-center justify-between mb-2">
                  <span>{model}</span>
                  <button
                    onClick={() => handleModelSelect(model)}
                    className="p-2 bg-blue-500 text-white rounded"
                  >
                    Add to Room
                  </button>
                </div>
              ))}
            </div>
            <button onClick={closeDialog} className="mt-4 p-2 bg-gray-500 text-white rounded w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPlanner;
