'use client';
import { useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { ShaderGradient } from '@shadergradient/react';

// Share the sculpture's canvas, camera and studio lighting. Never mount a second canvas.
export default function HeroAtmosphere() {
  const group = useRef(null);
  const { gl, invalidate } = useThree();
  useLayoutEffect(() => {
    const meshes = [];
    group.current.traverse(object => {
      if (!object.isMesh) return;
      meshes.push(object);
      object.material.transparent = true;
      object.material.opacity = 0.25;
      object.material.depthWrite = false;
      object.material.needsUpdate = true;
      object.onAfterRender = () => {
        gl.domElement.dataset.gradientRendered = 'true';
        gl.domElement.dataset.gradientFrames = String(Number(gl.domElement.dataset.gradientFrames || 0) + 1);
      };
    });
    invalidate();
    return () => meshes.forEach(mesh => { mesh.onAfterRender = () => {}; });
  }, [gl, invalidate]);
  return <group ref={group} scale={[2, 2, 1]}>
    <ShaderGradient control="props" type="plane" shader="defaults"
      animate="off" loop="off" grain="off" toggleAxis={false}
      color1="#151A17" color2="#454A3B" color3="#806B49"
      uTime={0} uSpeed={0} uStrength={0.3} uDensity={0.6}
      uFrequency={1.2} uAmplitude={0.2} reflection={0}
      positionX={0} positionY={0} positionZ={-3}
      rotationX={0} rotationY={0} rotationZ={0}
      lightType="none" cAzimuthAngle={0} cPolarAngle={90} cDistance={11}
      cameraZoom={1} zoomOut={false} enableTransition={false} />
  </group>;
}
