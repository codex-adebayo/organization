'use client';
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Color } from 'three';

// Three-colour smoothstep/mix approach adapted from Shader Gradient's default
// plane fragment, MIT © ruucm, stone-skipper. See notices/shadergradient-MIT.txt.
// Keep only colour blending: no version-dependent physical-lighting chunks.
const vertexShader = `
  varying vec3 vPos;
  void main() {
    vPos = position;
    // A fixed, broad relief field replaces the upstream time-driven displacement.
    vPos.z = 0.45 + 0.12 * sin(position.x * 0.55 + position.y * 0.4);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float opacity;
  varying vec3 vPos;
  void main() {
    vec3 colour = mix(
      mix(color1, color2, smoothstep(-3.0, 3.0, vPos.x)),
      color3, clamp(vPos.z, 0.0, 1.0)
    );
    gl_FragColor = vec4(colour, opacity);
    #include <colorspace_fragment>
  }
`;

export default function HeroAtmosphere() {
  const { gl } = useThree();
  const uniforms = useMemo(() => ({
    color1: { value: new Color('#151A17') },
    color2: { value: new Color('#454A3B') },
    color3: { value: new Color('#806B49') },
    opacity: { value: 0.25 }
  }), []);
  return <mesh position={[0, 0, -3]} onAfterRender={() => {
    gl.domElement.dataset.gradientRendered = 'true';
    gl.domElement.dataset.gradientFrames = String(Number(gl.domElement.dataset.gradientFrames || 0) + 1);
  }}>
    <planeGeometry args={[14, 14]} />
    <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}
      transparent depthWrite={false} toneMapped={false} />
  </mesh>;
}
