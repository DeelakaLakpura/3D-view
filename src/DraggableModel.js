import React, { useRef, useEffect, useState } from 'react';
import { TransformControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const DraggableModel = ({ url, initialScale = 1, onLoad }) => {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef();
  const controlsRef = useRef();

  // State for scale and rotation
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState([0, 0, 0]);

  useEffect(() => {
    if (modelRef.current && controlsRef.current) {
      controlsRef.current.attach(modelRef.current);
    }
  }, [modelRef, controlsRef]);

  // Trigger the onLoad callback after the model has been fully loaded
  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  // Use frame to apply scale and rotation dynamically
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(scale, scale, scale);
      modelRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  // Functions to handle size increase/decrease and rotation
  const increaseSize = () => setScale(prev => prev * 1.1);
  const decreaseSize = () => setScale(prev => prev * 0.9);
  const rotateLeft = () => setRotation(prev => [prev[0], prev[1] - Math.PI / 12, prev[2]]);
  const rotateRight = () => setRotation(prev => [prev[0], prev[1] + Math.PI / 12, prev[2]]);

  return (
    <>
      <primitive ref={modelRef} object={scene} />
      <TransformControls ref={controlsRef} object={modelRef.current} mode="translate" />

      {/* Buttons for controlling size and rotation */}
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <button onClick={increaseSize}>Increase Size</button>
        <button onClick={decreaseSize}>Decrease Size</button>
        <button onClick={rotateLeft}>Rotate Left</button>
        <button onClick={rotateRight}>Rotate Right</button>
      </div>
    </>
  );
};

export default DraggableModel;
