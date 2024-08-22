import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import useModelData from './useModelData';
import ModelSelector from './ModelSelector';
import DraggableModel from './DraggableModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Room from './Room';  // Make sure this import matches your file structure

const RoomPlanner = () => {
  const modelData = useModelData();
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [floorTextureUrl, setFloorTextureUrl] = useState('/floor.jpg');
  const [wallTextureUrl, setWallTextureUrl] = useState('/texture-2068283.jpg');
  const [floorWidth, setFloorWidth] = useState(50);
  const [floorHeight, setFloorHeight] = useState(50);
  const [wallWidth, setWallWidth] = useState(50);
  const [wallHeight, setWallHeight] = useState(25);

  const handleModelSelect = (model) => {
    const newModel = { url: model, id: Date.now(), scale: [2, 2, 2], rotation: [0, 0, 0] };
    setSelectedModels([...selectedModels, newModel]);
    setSelectedModelId(newModel.id);
  };

  const increaseSize = () => {
    console.log("Increasing size", selectedModelId);
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId
          ? { ...model, scale: model.scale.map((s) => s * 1.1) }
          : model
      )
    );
  };

  const decreaseSize = () => {
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId
          ? { ...model, scale: model.scale.map((s) => Math.max(s / 1.1, 1)) } // Decrease by 10%, with a minimum limit
          : model
      )
    );
  };

  const handleRotationChange = (event) => {
    const newAngle = parseFloat(event.target.value);
    console.log("Rotation change", newAngle);
    setRotationAngle(newAngle);
    setSelectedModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModelId
          ? { ...model, rotation: [0, newAngle * (Math.PI / 180), 0] }
          : model
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
            className="p-2 bg-gray-500 text-white rounded-full"
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

        <div className="mt-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Floor Dimensions</h2>
          <label className="block mb-2 text-gray-700">Width:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={floorWidth}
            onChange={(e) => setFloorWidth(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
          <div className="text-center text-gray-700">{floorWidth} units</div>

          <label className="block mt-4 mb-2 text-gray-700">Height:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={floorHeight}
            onChange={(e) => setFloorHeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
          <div className="text-center text-gray-700">{floorHeight} units</div>

          <h2 className="text-lg font-medium text-gray-700 mt-8 mb-2">Wall Dimensions</h2>
          <label className="block mb-2 text-gray-700">Width:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={wallWidth}
            onChange={(e) => setWallWidth(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
          <div className="text-center text-gray-700">{wallWidth} units</div>

          <label className="block mt-4 mb-2 text-gray-700">Height:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={wallHeight}
            onChange={(e) => setWallHeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
          <div className="text-center text-gray-700">{wallHeight} units</div>
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
          <Room
            floorTextureUrl={floorTextureUrl}
            wallTextureUrl={wallTextureUrl}
            floorWidth={floorWidth}
            floorHeight={floorHeight}
            wallWidth={wallWidth}
            wallHeight={wallHeight}
          />
          {selectedModels.map((model) => (
            <DraggableModel
              key={model.id}
              url={model.url}
              scale={20}
              rotation={model.rotation}
              onClick={() => handleModelClick(model.id)}
              bringToFront={bringToFront}
            />
          ))}
          <OrbitControls enableRotate={false} enablePan={false} />
        </Canvas>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 p-2 bg-gray-500 text-white rounded-full"
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
      </div>
    </div>
  );
};

export default RoomPlanner;
