import React from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';

const DraggableModel = ({ url }) => {
  const { scene, error } = useGLTF(url, true); // Ensure proper URL handling
  const modelRef = React.useRef();
  const controlsRef = React.useRef();

  React.useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
  }, [modelRef, controlsRef]);

  if (error) {
    console.error('Failed to load model:', error.message);
    return <p>Error loading model</p>;
  }

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={[1, 1, 1]} // Adjust scale as needed
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
