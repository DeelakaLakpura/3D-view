import React from 'react';
import ModelSelector from './ModelSelector';

const ParentComponent = () => {
  const handleModelSelect = (model) => {
    console.log('Selected model:', model);
  };

  return (
    <div>
      <ModelSelector onModelSelect={handleModelSelect} />
    </div>
  );
};

export default ParentComponent;
