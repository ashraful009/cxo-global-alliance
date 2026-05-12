import { useEffect, useState } from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import Layout from '../../components/common/Layout/Layout';
import PageBanner from '../../components/ui/PageBanner/PageBanner';
import Badge from '../../components/ui/Badge/Badge';
import EventModal from '../../components/ui/EventModal/EventModal';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ErrorState from '../../components/ui/ErrorState/ErrorState';
import SkeletonCard from '../../components/ui/SkeletonCard/SkeletonCard';
import { useToast } from '../../context/ToastContext';
import { getEvents } from '../../services/eventService';

const FILTERS = ['All', 'Upcoming', 'Closed'];

const Events = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    document.title = 'Events | CXO Global Alliance';
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    setError(false);
    getEvents()
      .then((data) => setEvents(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const isUpcoming = (event) => new Date(event.date) > new Date();

  const filtered = events.filter((e) => {
    if (activeFilter === 'Upcoming') return isUpcoming(e);
    if (activeFilter === 'Closed') return !isUpcoming(e);
    return true;
  });

  const handleCardClick = (event) => {
    if (!isUpcoming(event)) {
      showToast('This event is closed', 'info');
    } else {
      setSelectedEvent(event);
    }
  };

  const emptyMessages = {
    All: 'No events found.',
    Upcoming: 'No upcoming events at the moment.',
    Closed: 'No closed events.',
  };

  return (
    <Layout>
      <div className="bg-gray-950 min-h-screen pt-[70px]">

        <PageBanner
          title="Our Events"
          subtitle="Join us at our upcoming networking events and programs"
        />

        {/* Filter bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                  ${activeFilter === f
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} className="h-[420px]" />)}
            </div>
          ) : error ? (
            <ErrorState onRetry={fetchEvents} />
          ) : filtered.length === 0 ? (
            <EmptyState message={emptyMessages[activeFilter]} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => {
                const upcoming = isUpcoming(event);
                return (
                  <div
                    key={event._id}
                    onClick={() => handleCardClick(event)}
                    className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden cursor-pointer
                                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                                hover:border-blue-500/40 group
                                ${!upcoming ? 'opacity-70' : ''}`}
                  >
                    {/* Image */}
                    <div className="relative h-52 bg-gray-800 overflow-hidden">
                      <img
                        src={event.image || 'https://placehold.co/600x400/1f2937/6b7280?text=Event'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge type={upcoming ? 'upcoming' : 'closed'} />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h3 className="text-white font-bold text-base leading-snug mb-3 line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FiCalendar size={13} className="flex-shrink-0 text-blue-400" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                            {event.time && ` · ${event.time}`}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FiMapPin size={13} className="flex-shrink-0 text-blue-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>

                      {event.details && (
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                          {event.details}
                        </p>
                      )}

                      <button
                        className={`text-sm font-semibold uppercase tracking-wide transition-colors
                          ${upcoming
                            ? 'text-blue-400 group-hover:text-blue-300'
                            : 'text-gray-600 cursor-not-allowed'
                          }`}
                      >
                        {upcoming ? 'See Details →' : 'Closed'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </Layout>
  );
};

export default Events;
