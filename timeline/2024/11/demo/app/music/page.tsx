'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useVideoTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { songs, Song } from './mock/song'

extend({ OrbitControls })


export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // Assuming 3 minutes song
  const [volume, setVolume] = useState(1)
  const [currentLyrics, setCurrentLyrics] = useState<string>('')

  const audioRef = useRef<HTMLAudioElement>(null)
  const song: Song = songs[0] // 选择第一首歌

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      const currentLyric = song.lyrics.find(lyric => lyric.time <= audioRef.current!.currentTime && audioRef.current!.currentTime < lyric.time + 3)
      if (currentLyric) {
        setCurrentLyrics(currentLyric.text)
      }
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
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-3xl ">
  
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{song.title}</h2>
          <p className="text-sm mb-4">{song.artist}</p>
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
          <div className="mt-4 text-center">
            <p className="text-lg">{currentLyrics}</p>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={song.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  )
}