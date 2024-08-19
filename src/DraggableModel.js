import React, { useRef, useEffect } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';

const DraggableModel = ({ url, scale, rotation, onLoad, onClick, isSelected }) => {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
    if (onLoad) onLoad();
  }, [modelRef, controlsRef, onLoad]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = rotation;
    }
  }, [rotation]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={20}
        onClick={onClick}
        castShadow
        receiveShadow
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
