// src/ModelSelector.js
import React from 'react';

// Component for selecting and displaying models
const ModelSelector = ({ models, onModelSelect }) => {
  // Function to handle model selection
  const handleModelClick = (model) => {
    if (typeof onModelSelect === 'function') {
      onModelSelect(model.modelUrl); // Assuming you want to use modelUrl
    } else {
      console.error('onModelSelect is not a function');
    }
  };

  return (
    <div className="model-selector grid grid-cols-3 gap-4 p-4">
      {models.length > 0 ? (
        models.map((model) => (
          <div
            key={model.modelUrl} // Ensure each model item has a unique key
            className="model-item border border-gray-300 p-2 rounded cursor-pointer"
            onClick={() => handleModelClick(model)}
          >
            <img
              src={model.imageUrl}
              alt={model.productName} // or any other descriptive field
              className="w-full h-auto object-cover rounded"
            />
            <div className="mt-2 text-center text-lg font-semibold">
              {model.productName}
            </div>
          </div>
        ))
      ) : (
        <p>No models available.</p>
      )}
    </div>
  );
};

export default ModelSelector;
