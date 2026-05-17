import { Button } from '@/components/ui/button'
import { List, Repeat, Repeat1, Shuffle } from 'lucide-react'
import React from 'react'

interface PlaybackModeButtonProps {
  mode: "repeat" | "shuffle" | "list" | "repeat-one"
  onClick: () => void
}

export default function PlaybackModeButton({ mode, onClick }: PlaybackModeButtonProps) {
  const icons = {
    "repeat": <Repeat className="size-5" />,
    "shuffle": <Shuffle className="size-5" />,
    "list": <List className="size-5" />,
    "repeat-one": <Repeat1 className="size-5" />
  }
  return (
    <Button onClick={onClick} variant={"ghost"}>
      {icons[mode]}
    </Button>
  )
}
