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

function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-rose-500 selection:text-white overflow-hidden font-sans">
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
    </div>
  );
}

export default App;
