'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'

extend({ OrbitControls })

// 定义音乐数据结构
interface Song {
  id: number;
  title: string;
  artist: string;
  audioSrc: string;
  lyrics: { time: number; text: string }[];
}

const songs: Song[] = [
  {
    id: 1,
    title: "星空之歌",
    artist: "宇宙乐团",
    audioSrc: "/music/starsong.mp3",
    lyrics: [
      { time: 0, text: "在无垠的宇宙中" },
      { time: 5, text: "我们是渺小的尘埃" },
      { time: 10, text: "但我们的心" },
      { time: 15, text: "如星辰般闪耀" },
      // ... 更多歌词
    ]
  },
  // ... 可以添加更多歌曲
]

const VisualizerSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [frequency, setFrequency] = useState(0)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + frequency * 0.2)
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
    setFrequency(Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshPhongMaterial color="#4B0082" wireframe />
    </mesh>
  )
}

const Meteor = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [position, setPosition] = useState(new THREE.Vector3(Math.random() * 10 - 5, 5, Math.random() * 10 - 5))

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x -= 0.1
      meshRef.current.position.y -= 0.1
      if (meshRef.current.position.x < -5 || meshRef.current.position.y < -5) {
        setPosition(new THREE.Vector3(Math.random() * 10 - 5, 5, Math.random() * 10 - 5))
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#FFFFFF" />
    </mesh>
  )
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
      <VisualizerSphere />
      <Stars />
      {Array.from({ length: 20 }).map((_, index) => (
        <Meteor key={index} />
      ))}
      <OrbitControls enableZoom={false} />
    </>
  )
}

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song>(songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [currentLyric, setCurrentLyric] = useState("")

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    const lyric = currentSong.lyrics.find(l => l.time <= currentTime && (currentSong.lyrics[currentSong.lyrics.indexOf(l) + 1]?.time || Infinity) > currentTime)
    if (lyric) {
      setCurrentLyric(lyric.text)
    }
  }, [currentTime, currentSong])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0]
      setVolume(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden">
        <div className="h-64 relative">
          <Canvas>
            <Scene />
          </Canvas>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{currentSong.title}</h2>
          <p className="text-sm mb-4">{currentSong.artist}</p>
          <div className="text-center mb-4 h-8 overflow-hidden">
            <p className="text-lg font-semibold animate-fade-in-out">{currentLyric}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSliderChange}
              className="w-full mx-4"
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentSong.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  )
}