'use client'

import React, { useRef, useState } from 'react'
import AudioVisualizer from '@/app/music/_comp/AudioVisualizer'

const AudioVisualizerTest: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="relative w-64 h-64 rounded-full overflow-hidden">
        <audio ref={audioRef} src="/path/to/your/audio/file.mp3" />
        <AudioVisualizer audioRef={audioRef} />
      </div>
      <button
        onClick={handlePlayPause}
        className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-full"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  )
}

export default AudioVisualizerTest