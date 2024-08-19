import React, { useEffect, useRef } from 'react';
import { TransformControls, useGLTF } from '@react-three/drei';

const DraggableModel = ({ url, scale, onLoad, onClick, isSelected }) => {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
  }, [modelRef, controlsRef]);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale} // Ensure dynamic scale is applied
        onClick={onClick} // Handle model selection on click
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
