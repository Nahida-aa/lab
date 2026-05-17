"use client"
import { useEffect, useRef, useState } from "react";
import { songs, type Song } from "./mock/song"
import { motion } from 'framer-motion'
import A3DCard from "@/components/3d/ui/Card";
import styles from "./MusicPlayer.module.css";
import Image from "next/image";
import PlayerControls from "./_comp/PlayerControls";

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(202);
  const [playbackMode, setPlaybackMode] = useState<"repeat" | "shuffle" | "list" | "repeat-one">("repeat");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const song: Song = songs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const handlePlayPause = (e:any) => {
    e.stopPropagation()
    setIsPlaying(!isPlaying)}

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  const handleSliderChange = (values: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = values[0];
      setCurrentTime(values[0]);
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  }

  const handleVolumeChange = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }

  const handleNext = (e:any) => {
    e.stopPropagation()
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  }

  const handlePrev = (e:any) => {
    e.stopPropagation()
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  }

  const handlePlaybackModeChange = (e:any) => {
    e.stopPropagation()
    const modes: ('repeat' | 'shuffle' | 'list' | 'repeat-one')[] = ["repeat", "shuffle", "list", "repeat-one"];
    const currentIndex = modes.indexOf(playbackMode);
    setPlaybackMode(modes[(currentIndex + 1) % modes.length]);
  }

  const currentLyricIndex = song.lyrics.findIndex((lyric, index) => {
    return currentTime >= lyric.time && (
      index === song.lyrics.length - 1 || currentTime < song.lyrics[index + 1].time
    )
  });

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }

    const audio = audioRef.current;
    audio?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio?.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, []);

  useEffect(() => {
    const lyricsContainer = lyricsContainerRef.current;
    const activeLyric = document.getElementById(`lyric-${currentLyricIndex}`);
    if (lyricsContainer && activeLyric) {
      const containerHeight = lyricsContainer.clientHeight;
      const scrollPosition = activeLyric.offsetTop - containerHeight / 2 + activeLyric.clientHeight / 2;
      lyricsContainer.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentLyricIndex]);
  
  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <motion.div
      initial={{ opacity: 0,y:20 }}
      animate={{ opacity: 1,y:0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-3xl h-[768px]">
        <A3DCard className="h-full" enablePerspectiveEffect={true} enableHoverEffect={true}>
          <main className="flex flex-col h-full">
            <div className="flex-grow overflow-hidden relative">
              <div className="container mx-auto px-4 py-8 my-8 flex h-full">
                <div className="w-1/3 flex items-center  flex-col">
                  <div className={`w-full h-auto mt-8 rounded-full overflow-hidden ${styles.flicker}`}>
                    <Image src={song.img} alt="avatar" width={360} height={360} className={`object-center object-cover ${isPlaying ? styles.rotate : styles.paused}`}  />
                  </div>
                </div>

                <div className="w-2/3 flex flex-col justify-center items-center relative">
                  <h2 className="text-4xl font-bold mb-2 glow-cyan">{song.title}</h2>
                  <p className="text-xl mb-4">{song.artist}</p>
                  <div ref={lyricsContainerRef} className="h-full overflow-y-auto scrollbar-hide flex justify-center items-center w-full">
                    <div className="h-full relative flex flex-col items-center">
                      {song.lyrics.map((lyric, index) => (
                        <p key={index} id={`lyric-${index}`} 
                        className={`text-lg mb-2 transition-all duration-300
                        ${currentLyricIndex === index ? "glow-purple font-bold scale-110" : "text-gray-300"}`}
                        style={{
                          opacity: Math.max(0, 1 - Math.abs(currentLyricIndex - index) / 5)
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
              onPrev={handlePrev}
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
  );
}