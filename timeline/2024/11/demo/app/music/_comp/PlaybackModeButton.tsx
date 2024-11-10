import React from 'react'
import { Repeat, Shuffle, List, Repeat1 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlaybackModeButtonProps {
  mode: 'repeat' | 'shuffle' | 'list' | 'repeat-one'
  onClick: () => void
}

const PlaybackModeButton: React.FC<PlaybackModeButtonProps> = ({ mode, onClick }) => {
  const icons = {
    'repeat': <Repeat className="w-5 h-5" />,
    'shuffle': <Shuffle className="w-5 h-5" />,
    'list': <List className="w-5 h-5" />,
    'repeat-one': <Repeat1 className="w-5 h-5" />,
  }

  return (
    <Button onClick={onClick} variant={'ghost'} className="">
      {icons[mode]}
    </Button>
  )
}

export default PlaybackModeButton