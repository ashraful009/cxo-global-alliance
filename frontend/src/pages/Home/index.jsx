import { useEffect } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Hero from '../../components/common/Hero/Hero';
import EventsSection from '../../components/common/Events/EventsSection';
import FacilitiesSection from '../../components/common/Facilities/FacilitiesSection';
import MembersSection from '../../components/common/Members/MembersSection';
import Footer from '../../components/common/Footer/Footer';

const Home = () => {
  useEffect(() => { document.title = 'CXO Global Alliance | Connect · Collaborate · Lead'; }, []);
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Hero />
      <EventsSection />
      <FacilitiesSection />
      <MembersSection />
      <Footer />
    </div>
  );
};

export default Home;
