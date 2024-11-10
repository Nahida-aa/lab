import React, { useState } from 'react'
import { Volume2 } from 'lucide-react'

const VolumeControl: React.FC<{ onVolumeChange: (volume: number) => void }> = ({ onVolumeChange }) => {
  const [volume, setVolume] = useState(1)
  const [isHovered, setIsHovered] = useState(false)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    onVolumeChange(newVolume)
  }

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Volume2 className="w-5 h-5 cursor-pointer" />
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 w-8 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-300 rounded-full appearance-none transform rotate-270"
          />
        </div>
      )}
    </div>
  )
}

export default VolumeControl