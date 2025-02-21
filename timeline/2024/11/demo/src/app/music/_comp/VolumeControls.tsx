import { div } from 'framer-motion/client'
import { Volume2 } from 'lucide-react'
import React from 'react'

interface VolumeControlsProps {
  onVolumeChange: (volume: number) => void
}
export default function VolumeControls({
  onVolumeChange
}: VolumeControlsProps
) {
  const [volume, setVolume] = React.useState<number>(1)
  const [isHovered, setIsHovered] = React.useState<boolean>(false)
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value)
    setVolume(volume)
    onVolumeChange(volume)
  }
  return (
    <div className='relative  ' onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>
      <Volume2 className='size-5 cursor-pointer' />
      {isHovered && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className='absolute top-0 left
          -0.5 w-16 h-6 bg-white rounded-full shadow-md'
        />
      )}
    </div>
  )
}