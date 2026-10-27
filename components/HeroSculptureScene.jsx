'use client';
import { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, Shape, Vector3, PMREMGenerator } from 'three';
import HeroAtmosphere from './HeroAtmosphere';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function Studio({ onReady, onLost }) {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    invalidate();
    onReady();
    const lost = event => { event.preventDefault(); onLost(); };
    const restored = () => { invalidate(); onReady(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    gl.domElement.addEventListener('webglcontextrestored', restored);
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', lost);
      gl.domElement.removeEventListener('webglcontextrestored', restored);
      scene.environment = null;
      environment.dispose();
      generator.dispose();
      room.dispose();
    };
  }, [gl, scene, invalidate, onReady, onLost]);
  return null;
}

function Convergence() {
  const { shape, seam } = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0.3, -0.3);
    shape.lineTo(2, -0.3);
    shape.quadraticCurveTo(2.95, -0.3, 3.45, 0.65);
    shape.lineTo(3.45, 1.2);
    shape.quadraticCurveTo(2.75, 0.3, 2, 0.3);
    shape.lineTo(0.3, 0.3);
    shape.closePath();
    const seam = new CatmullRomCurve3([
      new Vector3(0.4, 0, 0.46), new Vector3(1.9, 0, 0.46),
      new Vector3(2.75, 0.25, 0.46), new Vector3(3.4, 0.91, 0.46)
    ]);
    return { shape, seam };
  }, []);
  return <group rotation={[0.55, -0.35, -0.25]} position={[0, 0.15, 0]}>
    {[0, 2 * Math.PI / 3, 4 * Math.PI / 3].map(angle => <group key={angle} rotation={[0, 0, angle]}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: 0.32, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.08, curveSegments: 20 }]} />
        <meshStandardMaterial color="#303630" metalness={0.72} roughness={0.37} />
      </mesh>
      <mesh>
        <tubeGeometry args={[seam, 36, 0.022, 6, false]} />
        <meshStandardMaterial color="#d5b16d" metalness={0.8} roughness={0.3} emissive="#ad7732" emissiveIntensity={0.2} />
      </mesh>
    </group>)}
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]} castShadow>
      <cylinderGeometry args={[0.67, 0.67, 0.5, 64]} />
      <meshStandardMaterial color="#292e28" metalness={0.7} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0, 0.44]}>
      <torusGeometry args={[0.45, 0.055, 12, 64]} />
      <meshStandardMaterial color="#e0bc77" metalness={0.8} roughness={0.27} emissive="#d49a47" emissiveIntensity={0.3} />
    </mesh>
    <mesh position={[0, 0, 0.43]}>
      <circleGeometry args={[0.39, 48]} />
      <meshStandardMaterial color="#b99049" metalness={0.8} roughness={0.4} />
    </mesh>
  </group>;
}

export default function HeroSculptureScene({ onReady, onLost }) {
  return <div className="sculpture-canvas">
    <Canvas frameloop="demand" dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 11], fov: 43 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={null}>
      <Studio onReady={onReady} onLost={onLost} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 6, 7]} intensity={3} color="#fff0d4" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[4, 1, 3]} intensity={35} color="#e9b960" />
      <HeroAtmosphere />
      <Convergence />
      <mesh position={[0, 0, -1.1]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </Canvas>
  </div>;
}
