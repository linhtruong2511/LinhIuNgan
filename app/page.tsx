import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import SectionNavigator from "@/components/SectionNavigator";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";
import GiftBox from "@/components/GiftBox";
import BirthdayCake from "@/components/BirthdayCake";
import LoveLetter from "@/components/LoveLetter";
import MemoryGallery from "@/components/MemoryGallery";

export default function Home() {
  return (
    <main className="relative">
      <SectionNavigator />
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      <GiftBox />
      <BirthdayCake />
      <LoveLetter />
      <MemoryGallery />
    </main>
  );
}
