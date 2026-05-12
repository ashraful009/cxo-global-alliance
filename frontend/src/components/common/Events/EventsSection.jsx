import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getEvents } from '../../../services/eventService';
import useFetch from '../../../hooks/useFetch';
import EventModal from '../../ui/EventModal/EventModal';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import Badge from '../../ui/Badge/Badge';
import SliderArrow from '../../ui/SliderArrow/SliderArrow';
import SkeletonCard from '../../ui/SkeletonCard/SkeletonCard';

const EventsSection = () => {
  const { data, loading, error } = useFetch(getEvents);
  const events = data || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, events.length - itemsToShow);
  // Clamp index so it never exceeds maxIndex after a responsive resize
  const safeIndex = Math.min(currentIndex, maxIndex);
  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCardClick = (event) => {
    const isUpcoming = new Date(event.date) > new Date();
    if (!isUpcoming) showToast('This event is closed');
    else setSelectedEvent(event);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="h-10 bg-gray-800 animate-pulse rounded w-48 mx-auto mb-3"></div>
            <div className="h-5 bg-gray-800 animate-pulse rounded w-72 mx-auto mb-5"></div>
            <div className="flex justify-center">
              <div className="h-1 bg-gray-800 animate-pulse rounded w-14"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} className="h-[400px]" />)}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Events" subtitle="Join our upcoming executive networking sessions." />
          <p className="text-center text-red-400 mt-2">Failed to load data. Please try again.</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Events" subtitle="Join our upcoming executive networking sessions." />
          <p className="text-center text-gray-500 mt-2">No events available at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }

  const cardWidthClass = {
    1: 'w-full',
    2: 'w-[calc(50%-12px)]',
    3: 'w-[calc(33.333%-16px)]',
  }[itemsToShow];

  const translateOffset = `calc(-${safeIndex * (100 / itemsToShow)}% - ${safeIndex * (24 / itemsToShow)}px)`;

  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          title="Our Events"
          subtitle="Join our upcoming executive networking sessions."
        />

        {/* Desktop arrow controls */}
        <div className="hidden md:flex justify-end gap-3 -mt-6 mb-8">
          <SliderArrow direction="left" onClick={prevSlide} disabled={safeIndex === 0} />
          <SliderArrow direction="right" onClick={nextSlide} disabled={safeIndex >= maxIndex} />
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Mobile overlay arrows */}
          {safeIndex > 0 && (
            <button
              onClick={prevSlide}
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white focus:outline-none"
              aria-label="Previous"
            >
              <FiChevronLeft size={22} />
            </button>
          )}
          {safeIndex < maxIndex && (
            <button
              onClick={nextSlide}
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white focus:outline-none"
              aria-label="Next"
            >
              <FiChevronRight size={22} />
            </button>
          )}

          <div className="overflow-hidden px-1 py-2 -mx-1">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(${translateOffset})` }}
            >
              {events.map((event) => {
                const isUpcoming = new Date(event.date) > new Date();
                return (
                  <div
                    key={event._id}
                    className={`flex-none rounded-xl overflow-hidden shadow-lg group relative cursor-pointer
                                transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl
                                ${cardWidthClass}`}
                    onClick={() => handleCardClick(event)}
                  >
                    {/* Background image */}
                    <div className="h-[400px] w-full relative">
                      <img
                        src={event.image || 'https://placehold.co/400x600/1f2937/6b7280?text=Event'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent"></div>
                    </div>

                    {/* Top-right badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge type={isUpcoming ? 'upcoming' : 'closed'} />
                    </div>

                    {/* Bottom-left content */}
                    <div className="absolute bottom-0 left-0 w-full p-5 z-10 text-white">
                      <h3 className="text-lg font-bold mb-1 leading-tight line-clamp-2">{event.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                      <button
                        className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                          isUpcoming
                            ? 'text-blue-400 group-hover:text-blue-300'
                            : 'text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={(e) => { e.stopPropagation(); handleCardClick(event); }}
                      >
                        {isUpcoming ? 'See Details →' : 'Closed'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-lg shadow-2xl text-sm">
          {toastMessage}
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
};

export default EventsSection;
