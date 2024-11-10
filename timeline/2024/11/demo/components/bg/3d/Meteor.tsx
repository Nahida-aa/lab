'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MeteorShader = {
  vertexShader: `
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      pos.y += sin(pos.x * 10.0 + time) * 0.1;
      pos.x += sin(pos.z * 10.0 + time) * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      float alpha = smoothstep(0.0, 0.5, 1.0 - length(uv - 0.5) * 2.0);
      vec3 color = vec3(1.0, 0.5, 0.2);
      gl_FragColor = vec4(color, alpha * (0.5 + 0.5 * sin(time * 5.0)));
    }
  `
}

const Meteor = ({ position, rotation, scale }) => {
  const meshRef = useRef()
  const materialRef = useRef()

  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
    }
    if (meshRef.current) {
      meshRef.current.position.x -= 0.05
      meshRef.current.position.y -= 0.05
      if (meshRef.current.position.x < -10 || meshRef.current.position.y < -10) {
        meshRef.current.position.set(
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 10 - 5
        )
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={MeteorShader.vertexShader}
        fragmentShader={MeteorShader.fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

const MeteorShower = () => {
  const groupRef = useRef()
  const meteors = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 10 - 5],
      rotation: [0, 0, Math.random() * Math.PI],
      scale: [0.1 + Math.random() * 0.3, 0.1 + Math.random() * 0.3, 0.1]
    }))
  }, [])

  return (
    <group ref={groupRef}>
      {meteors.map((props, i) => (
        <Meteor key={i} {...props} />
      ))}
    </group>
  )
}

export default MeteorShower