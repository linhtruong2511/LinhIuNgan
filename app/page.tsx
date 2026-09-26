import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-deep-night relative">
      <ParticlesBg />
      <MusicPlayer />
      <h1 className="text-4xl font-dancing text-teal-accent text-glow z-10 relative">
        Happy Birthday ❤️
      </h1>
    </main>
  );
}
