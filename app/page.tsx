import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      {/* Placeholder for remaining sections */}
      <div className="h-screen bg-ocean-blue flex items-center justify-center">
        <p className="text-white/30 text-xl">More sections coming...</p>
      </div>
    </main>
  );
}
