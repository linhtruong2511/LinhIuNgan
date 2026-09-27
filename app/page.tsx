import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import SceneManager from "@/components/SceneManager";

export default function Home() {
  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-deep-night">
      <ParticlesBg />
      <MusicPlayer />
      <SceneManager />
    </main>
  );
}
