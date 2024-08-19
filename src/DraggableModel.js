import React from 'react';
import { TransformControls, useGLTF } from '@react-three/drei';

const DraggableModel = ({ url, scale, onLoad }) => {
  const { scene } = useGLTF(url, true); // Load the model, ensure correct url handling
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

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={20} // Apply dynamic scale
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
