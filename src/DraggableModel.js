import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const DraggableModel = ({ url, scale, rotation, isSelected, onLoad, onClick }) => {
  const { scene, } = useGLTF(url, true); // Load the model
  const modelRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
  }, [modelRef, controlsRef]);

  useEffect(() => {
    if (onLoad) onLoad(); // Trigger onLoad callback
  }, [onLoad]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      rotation={[0, rotation, 0]} // Apply rotation
      onClick={onClick}
      onLoad={onLoad} // Ensure onLoad is triggered
    >
      {/* Ensure the textures are loaded */}
    </primitive>
  );
};

export default DraggableModel;
