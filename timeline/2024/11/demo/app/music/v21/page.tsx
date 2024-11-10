'use client'

import React, { useRef, useState, useEffect } from 'react'
import { songs, Song } from '@/app/music/mock/song'
import PlayerControls from '@/app/music/_comp/PlayerControls'
import Image from 'next/image'
import styles from '@/app/music/v2/css.module.css'
import { motion } from 'framer-motion'
import { A3DCard } from '@/components/3d/ui/Card'

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(202)
  const [playbackMode, setPlaybackMode] = useState<'repeat' | 'shuffle' | 'list' | 'repeat-one'>('repeat')

  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)
  const song: Song = songs[currentSongIndex]

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSongIndex])

  const handlePlayPause = () => setIsPlaying(!isPlaying)

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
  const handleVolumeChange = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length)
  }

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length)
  }

  const handlePlaybackModeChange = () => {
    const modes: ('repeat' | 'shuffle' | 'list' | 'repeat-one')[] = ['repeat', 'shuffle', 'list', 'repeat-one']
    setPlaybackMode(modes[(modes.indexOf(playbackMode) + 1) % modes.length])
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const currentLyricIndex = song.lyrics.findIndex(
    (lyric, index) => 
      lyric.time <= currentTime && 
      (index === song.lyrics.length - 1 || song.lyrics[index + 1].time > currentTime)
  )

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const audio = audioRef.current
    audio?.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audio?.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  useEffect(() => {
    const lyricsContainer = lyricsContainerRef.current
    const activeLyric = document.getElementById(`lyric-${currentLyricIndex}`)

    if (activeLyric && lyricsContainer) {
      const containerHeight = lyricsContainer.clientHeight
      const scrollPosition = activeLyric.offsetTop - containerHeight / 2 + activeLyric.clientHeight / 2
      lyricsContainer.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    }
  }, [currentLyricIndex])

  return (
    <main className="flex flex-col h-screen items-center justify-center ">
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative z-10 w-full max-w-3xl h-[768px]"
  >
    <A3DCard enablePressureEffect={true} enableFlipEffect={true} className='h-full'>
<main className='flex flex-col h-full'>


      <div className="flex-grow overflow-hidden relative">
        <div className="container mx-auto px-4 py-8 my-8 flex h-full">
          <div className="w-1/3 flex items-center flex-col">
            <div className="h-24 w-full"></div>
            <div className={`w-full h-auto rounded-full overflow-hidden ${styles.flicker}`}>
              <Image src="/avatar/star-360-d.webp" alt="" width={360} height={360} className="object-center object-cover" />
            </div>
          </div>
          <div className="w-2/3 flex flex-col justify-center items-center relative">
            <h2 className="text-4xl font-bold mb-2">{song.title}</h2>
            <p className="text-xl mb-4">{song.artist}</p>
            <div ref={lyricsContainerRef} className="h-full overflow-y-auto scrollbar-hide flex justify-center items-center w-full">
              <div className="relative h-full flex flex-col items-center">
                {song.lyrics.map((lyric, index) => (
                  <p
                    id={`lyric-${index}`}
                    key={index}
                    className={`text-lg mb-2 transition-all duration-300 ${
                      index === currentLyricIndex
                        ? 'glow-purple font-bold scale-110'
                        : 'text-gray-300'
                    }`}
                    style={{
                      opacity: Math.max(0, 1 - Math.abs(index - currentLyricIndex) / 10),
                    }}
                  >
                    {lyric.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlayerControls
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        playbackMode={playbackMode}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSliderChange={handleSliderChange}
        onPlaybackModeChange={handlePlaybackModeChange}
        onVolumeChange={handleVolumeChange}
      />
      <audio
        ref={audioRef}
        src={song.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleNext}
      />
      </main>
    </A3DCard>
    </motion.div>
    </main>
  )
}