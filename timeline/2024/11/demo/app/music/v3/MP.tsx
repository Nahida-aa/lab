"use client"
// components/MusicPlayer.tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { songs, Song } from '@/app/music/mock/song'

interface MusicPlayerProps {
  song: Song;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ song }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null); // 父容器引用
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 播放/暂停切换
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 时间更新事件
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audio = audioRef.current;
    audio?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // 获取当前歌词
  const getCurrentLyricIndex = () => {
    return song.lyrics.findIndex(
      (lyric, index) =>
        lyric.time <= currentTime &&
        (index === song.lyrics.length - 1 || song.lyrics[index + 1].time > currentTime)
    );
  };

  const currentLyricIndex = getCurrentLyricIndex();

  // 让当前歌词滚动到视口的中心
  useEffect(() => {
    const lyricsContainer = lyricsRef.current;
    const activeLyric = document.getElementById(`lyric-${currentLyricIndex}`);

    if (activeLyric && lyricsContainer) {
      const containerHeight = lyricsContainer.clientHeight;
      const scrollPosition = activeLyric.offsetTop - containerHeight / 2 + activeLyric.clientHeight / 2;
      lyricsContainer.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentLyricIndex]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{song.title}</h2>
      <h3 className="text-md text-gray-600">{song.artist}</h3>
      <audio ref={audioRef} src={song.audioSrc} preload="auto" />
      
      <div className="flex items-center space-x-2 my-4">
        <Button onClick={togglePlay}>
          {isPlaying ? "暂停" : "播放"}
        </Button>
      </div>

      <div
        ref={lyricsRef}
        className="relative h-64 overflow-y-auto bg-gray-100 rounded-lg p-4"
      >
        <ul className="space-y-2">
          {song.lyrics.map((lyric, index) => (
            <li
              id={`lyric-${index}`}
              key={index}
              className={`text-center ${
                index === currentLyricIndex ? "text-blue-500 font-bold" : "text-gray-500"
              }`}
            >
              {lyric.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;
