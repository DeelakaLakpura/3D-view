import React from 'react';
import { useGLTF ,TransformControls } from '@react-three/drei';

const DraggableModel = ({ url, scale, onLoad }) => {
  const { scene, materials, nodes } = useGLTF(url, true); // Load the model, ensure correct url handling
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

  // Adjust material properties if needed
  React.useEffect(() => {
    if (materials) {
      Object.values(materials).forEach((material) => {
        material.needsUpdate = true;
      });
    }
  }, [materials]);

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
