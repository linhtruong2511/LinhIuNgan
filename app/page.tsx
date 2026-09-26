import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";
import GiftBox from "@/components/GiftBox";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      <GiftBox />
      {/* Placeholder for remaining sections */}
      <div className="h-screen bg-deep-night" />
    </main>
  );
}
