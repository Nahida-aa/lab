'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import MeteorShower from '@/components/bg/3d/Meteor'

extend({ OrbitControls })

// ... (previous code for Song interface and songs array remains unchanged)

const VisualizerSphere = () => {
  // ... (VisualizerSphere code remains unchanged)
}

const Star = ({ position }: { position: [number, number, number] }) => {
  // ... (Star code remains unchanged)
}

const Stars = () => {
  // ... (Stars code remains unchanged)
}

const Scene = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.setZ(5)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* <VisualizerSphere />
      <Stars /> */}
      <MeteorShower />
      <OrbitControls enableZoom={false} />
    </>
  )
}

export default function MusicPlayer() {
  // ... (MusicPlayer code remains unchanged)

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Scene />
        </Canvas>
      </div>
      {/* ... (rest of the JSX remains unchanged) */}
    </div>
  )
}