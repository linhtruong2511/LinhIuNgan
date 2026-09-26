import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      {/* Placeholder for remaining sections */}
      <div className="h-screen bg-deep-night" />
    </main>
  );
}
