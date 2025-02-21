import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import React from 'react'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import PlaybackModeButton from './PlaybackModeButton'
import VolumeControls from './VolumeControls'

interface PlayerControlsProps {
  currentTime: number
  duration: number
  isPlaying: boolean
  playbackMode: "repeat" | "shuffle" | "list" | "repeat-one"
  onPlayPause: (e?:any) => void
  onPrev: (e?:any) => void
  onNext: (e?:any) => void
  onSliderChange: (value: number[]) => void
  onPlaybackModeChange: (e?:any) => void
  onVolumeChange: (volume: number) => void
}
export default function PlayerControls(
  { currentTime,
    duration,
    isPlaying,
    playbackMode,
    onPlayPause,
    onPrev,
    onNext,
    onSliderChange,
    onPlaybackModeChange,
    onVolumeChange
  }: PlayerControlsProps
) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
  return (
    <aside className='p-4.'>
      <Slider value={[currentTime]} min={0} max={duration} step={1} onValueChange={onSliderChange} />

      <div className="flex justify-between items-center mt-2">
        <span className='text-sm'>{formatTime(currentTime)}</span>
        <div className='flex items-center space-x-4'>
          <Button onClick={onPrev} className='text-2xl' variant={"ghost"}>
            <SkipBack className="size-5" />
          </Button>
          <Button onClick={onPlayPause} className='text-4xl' variant={"ghost"}>
            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
          </Button>
          <Button onClick={onNext} className='text-2xl' variant={"ghost"}>
            <SkipForward className="size-5" />
          </Button>
          <PlaybackModeButton mode={playbackMode} onClick={onPlaybackModeChange} />
        </div>
        <div className="flex items-center space-x-2">
          <VolumeControls onVolumeChange={onVolumeChange} />
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
      </div>
    </aside>
  )
}
