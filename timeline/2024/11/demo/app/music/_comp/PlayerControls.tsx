"use client"

import React from "react"
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import PlaybackModeButton from '@/app/music/_comp/PlaybackModeButton'
import VolumeControl from '@/app/music/_comp/VolumeControl'
import { Button } from '@/components/ui/button'

interface PlayerControlsProps {
  currentTime: number
  duration: number
  isPlaying: boolean
  playbackMode: 'repeat' | 'shuffle' | 'list' | 'repeat-one'
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
  onSliderChange: (value: number[]) => void
  onPlaybackModeChange: () => void
  onVolumeChange: (volume: number) => void
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  playbackMode,
  onPlayPause,
  onPrevious,
  onNext,
  onSliderChange,
  onPlaybackModeChange,
  onVolumeChange
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <aside className="p-4">
      <Slider value={[currentTime]} max={duration} step={1} onValueChange={onSliderChange} className="relative flex w-full touch-none select-none items-center" />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-4">
          <PlaybackModeButton mode={playbackMode} onClick={onPlaybackModeChange} />
          <button onClick={onPrevious} className="p-2 hover:bg-gray-700 rounded-full">
            <SkipBack className="w-5 h-5" />
          </button>
          <Button onClick={onPlayPause} variant={"ghost"} className="p-3 ">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <button onClick={onNext} className="p-2 hover:bg-gray-700 rounded-full">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <VolumeControl onVolumeChange={onVolumeChange} />
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
      </div>
    </aside>
  )
}

export default PlayerControls