'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Create a gentle flowing wave effect
    float noiseFreq = 2.0;
    float noiseAmp = 0.4;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
    pos.z += sin(noisePos.x) * noiseAmp * sin(pos.y * 3.14);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  void main() {
    // Mix two colors based on vertical position
    vec3 color = mix(uColor1, uColor2, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`

function WavingFabric() {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#F2AFA3') }, // Salmon Pink
      uColor2: { value: new THREE.Color('#E8C5BC') }, // Peachy Nude
    }),
    []
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 6, 0, 0]} position={[0, 0, -2]}>
      <planeGeometry args={[10, 6, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  )
}

export function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 bg-cocoa">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        <WavingFabric />
      </Canvas>
    </div>
  )
}
