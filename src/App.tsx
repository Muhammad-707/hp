import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Fireworks } from './components/Fireworks';
import { BirthdayCake } from './components/BirthdayCake';
import { MessageLetter } from './components/MessageLetter';
import { MilestoneTimeline } from './components/MilestoneTimeline';
import { PhotoGallery } from './components/PhotoGallery';
import { WishesSlider } from './components/WishesSlider';
import { CelebrateButton } from './components/CelebrateButton';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { MusicPlayer } from './components/MusicPlayer';
import { cn } from "@/lib/utils";

function App() {
  return (
    <div className={cn('relative', 'bg-background', 'selection:bg-rose-500', 'min-h-screen', 'overflow-hidden', 'font-sans', 'text-foreground', 'selection:text-white')}>
      <LoadingScreen />
      <Header />

      <main>
        <Hero />
        <Fireworks />
        <BirthdayCake />
        <MessageLetter />
        <MilestoneTimeline />
        <PhotoGallery />
        <WishesSlider />
        <CelebrateButton />
      </main>

      <Footer />
      <MusicPlayer />
    </div>
  );
}

export default App;