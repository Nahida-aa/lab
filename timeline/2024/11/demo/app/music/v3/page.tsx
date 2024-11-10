// app/page.tsx
import MusicPlayer from "./MP";
import { songs, Song } from '@/app/music/mock/song'

export default function HomePage() {
  return (
    <main className="p-4">
      <MusicPlayer song={songs[0]} />
    </main>
  );
}
