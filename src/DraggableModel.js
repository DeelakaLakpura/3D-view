import React, { useRef } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';

const DraggableModel = ({ url, scale, onLoad, onClick, isSelected, onRotate }) => {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef();
  const controlsRef = useRef();
  const rotationControlsRef = useRef();

  React.useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
    if (rotationControlsRef.current) {
      rotationControlsRef.current.attach(modelRef.current);
    }
    if (onLoad) onLoad();
  }, [modelRef, controlsRef, rotationControlsRef, onLoad]);

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
        <>
          <TransformControls
            ref={controlsRef}
            object={modelRef.current}
            mode="translate"
          />
          <TransformControls
            ref={rotationControlsRef}
            object={modelRef.current}
            mode="rotate"
            onChange={onRotate} // Optional: Callback for rotation changes
          />
        </>
      )}
    </>
  );
};

export default DraggableModel;
