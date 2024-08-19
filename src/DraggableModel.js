import React, { useRef } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';

const DraggableModel = ({ url, scale, onLoad, onClick, isSelected }) => {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef();
  const controlsRef = useRef();

  React.useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
    if (onLoad) onLoad();
  }, [modelRef, controlsRef, onLoad]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale}
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
