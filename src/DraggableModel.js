import React, { useEffect, useRef } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';

const DraggableModel = ({ url, scale, onSelect, isSelected, onLoad }) => {
  const { scene } = useGLTF(url, true); 
  const modelRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
  }, [modelRef, controlsRef]);

  useEffect(() => {
    if (isSelected) {
      controlsRef.current.setMode('scale'); // Enable scaling mode for selected model
    } else {
      controlsRef.current.setMode('translate'); // Disable scaling mode for other models
    }
  }, [isSelected]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale} 
        onClick={onSelect} // Select the model on click
        onPointerMissed={() => onSelect(null)} // Deselect on miss
      />
      {isSelected && (
        <TransformControls
          ref={controlsRef}
          object={modelRef.current}
          mode="translate"
        />
      )}
    </>
  );
};

export default DraggableModel;
