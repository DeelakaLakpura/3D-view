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
  }, [modelRef, controlsRef]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(...scale);
      modelRef.current.rotation.y = rotation;
    }
  }, [scale, rotation]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale}
        rotation={[0, rotation, 0]}
        onClick={onClick}
        onLoad={onLoad}
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
