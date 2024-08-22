import React from 'react';
import { TransformControls, useGLTF } from '@react-three/drei';

const DraggableModel = ({ url, scale, onLoad }) => {
  console.log('Loading model from URL:', url); // Debug URL
  const { scene, error } = useGLTF(url, true); // Load the model with error handling
  const modelRef = React.useRef();
  const controlsRef = React.useRef();

  React.useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
  }, [modelRef, controlsRef]);

  // Trigger the onLoad callback after the model has been fully loaded
  React.useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  if (error) {
    console.error('Error loading model:', error);
    return null; // or return an error message component
  }

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale} // Apply dynamic scale
      />
      <TransformControls
        ref={controlsRef}
        object={modelRef.current}
        mode="translate"
      />
    </>
  );
};

export default DraggableModel;
