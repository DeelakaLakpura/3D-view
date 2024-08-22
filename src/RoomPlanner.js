import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import useModelData from './useModelData';
import ModelSelector from './ModelSelector';
import DraggableModel from './DraggableModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Room = ({ floorTextureUrl, wallTextureUrl }) => {
  const floorTexture = useTexture(floorTextureUrl);
  const wallTexture = useTexture(wallTextureUrl);

  return (
    <>
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

  {/* Advanced Lighting */}
  <ambientLight intensity={0.4} />
  <pointLight position={[10, 20, 10]} intensity={1.5} color="white" />
  <spotLight position={[0, 30, 0]} angle={0.5} penumbra={1} intensity={2} color="white" />
  <hemisphereLight skyColor="skyblue" groundColor="darkslategray" intensity={0.5} />

  {/* Decorative Elements */}
  {/* Columns with ornate details */}
  <mesh receiveShadow position={[-24, 12.5, -24]}>
    <cylinderGeometry args={[1, 1, 10, 32]} />
    <meshStandardMaterial color="gold" />
  </mesh>

  <mesh receiveShadow position={[24, 12.5, -24]}>
    <cylinderGeometry args={[1, 1, 10, 32]} />
    <meshStandardMaterial color="gold" />
  </mesh>

  {/* Wall Art */}
  <mesh position={[0, 15, -24.5]}>
    <planeGeometry args={[12, 6]} />
 
  </mesh>

  {/* Ceiling Patterns */}
  <mesh rotation={[Math.PI, 0, 0]} position={[0, 25, 0]}>
    <planeGeometry args={[50, 50]} />

  </mesh>

  {/* Furniture and Decor */}
  {/* Modern Sofa */}
  <mesh position={[0, 1, -10]}>
    <boxGeometry args={[8, 3, 4]} />
    <meshStandardMaterial color="beige" />
  </mesh>

  {/* Stylish Coffee Table */}
  <mesh position={[0, 1, -5]}>
    <boxGeometry args={[4, 0.5, 4]} />
    <meshStandardMaterial color="darkbrown" />
  </mesh>

  {/* Floor Rug */}
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -10]}>
    <planeGeometry args={[10, 5]} />
   
  </mesh>

  {/* Decorative Plants */}
  <mesh position={[-15, 1, -15]}>
    <coneGeometry args={[1, 5, 32]} />
    <meshStandardMaterial color="green" />
  </mesh>

  <mesh position={[15, 1, -15]}>
    <coneGeometry args={[1, 5, 32]} />
    <meshStandardMaterial color="green" />
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
  const [floorTextureUrl, setFloorTextureUrl] = useState('/floor.jpg');
  const [wallTextureUrl, setWallTextureUrl] = useState('/texture-2068283.jpg');

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

  const handleTextureChange = (textureType, textureUrl) => {
    if (textureType === 'floor') {
      setFloorTextureUrl(textureUrl);
    } else if (textureType === 'wall') {
      setWallTextureUrl(textureUrl);
    }
  };

  const textureOptions = [
    { type: 'floor', url: '/tile_floor.jpg' },
    { type: 'floor', url: '/wood_floor.jpg' },
    { type: 'wall', url: '/wood.jpg' },
    { type: 'wall', url: '/wall_s.jpg' },
    { type: 'wall', url: '/wall_y.jpg' },
  ];

  return (
    <div className="relative h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-10 bg-gray-100 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-full md:w-64 h-full p-4 overflow-y-auto border-r border-gray-300`}
        style={{ height: '100vh' }}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 bg-gray-500 text-white rounded-full"
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
            />
            <div className="text-center text-gray-700">{rotationAngle}°</div>
          </div>
          <button onClick={resetScene} className="block w-full p-2 bg-gray-500 text-white mt-2">
            Reset Scene
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Change Textures</h2>
          <div className="grid grid-cols-2 gap-2">
            {textureOptions.map((texture, index) => (
              <div key={index} className="w-12 h-12">
                <img
                  src={texture.url}
                  alt={`Texture ${index}`}
                  className="w-full h-full object-cover rounded-full cursor-pointer"
                  onClick={() => handleTextureChange(texture.type, texture.url)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <Canvas
          shadows
          camera={{ position: [0, 31.5, 50], fov: 60 }}
          className="w-full h-full bg-light-gray"
        >
          <ambientLight intensity={1} />
          <spotLight position={[20, 40, 10]} angle={0.3} penumbra={0.5} castShadow />
          <spotLight position={[-20, 40, 10]} angle={0.3} penumbra={0.5} castShadow />
          <Room floorTextureUrl={floorTextureUrl} wallTextureUrl={wallTextureUrl} />
          {selectedModels.map((model) => (
            <DraggableModel
              key={model.id}
              url={model.url}
              scale={model.scale}
              rotation={model.rotation}
              onClick={() => handleModelClick(model.id)}
              bringToFront={bringToFront}
            />
          ))}
          <OrbitControls enableRotate={false} enablePan={false} />
        </Canvas>

        {/* Sidebar Toggle Button (for larger screens) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 p-2 bg-gray-500 text-white rounded-full md:hidden"
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
      </div>
    </div>
  );
};

export default RoomPlanner;
