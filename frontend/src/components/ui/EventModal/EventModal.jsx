import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { FaRegCalendarAlt, FaRegClock, FaMapMarkerAlt } from 'react-icons/fa';
import Badge from '../Badge/Badge';

const EventModal = ({ event, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!event) return null;

  const isUpcoming = new Date(event.date) > new Date();

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-600 hover:text-gray-900 hover:shadow-lg transition-all focus:outline-none"
          aria-label="Close modal"
        >
          <FiX size={18} />
        </button>

        {/* Header image */}
        <div className="w-full h-64 sm:h-72 relative bg-gray-100 flex-shrink-0">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm rounded-t-2xl">
              No Image Available
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge type={isUpcoming ? 'upcoming' : 'closed'} />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 flex-grow">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">
            {event.title}
          </h2>

          {/* Meta info */}
          <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center text-gray-700">
              <FaRegCalendarAlt className="mr-3 text-blue-600 flex-shrink-0" />
              <span className="font-medium text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaRegClock className="mr-3 text-blue-600 flex-shrink-0" />
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-3 text-blue-600 flex-shrink-0" />
              <span className="text-sm">{event.location}</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-600 text-sm leading-relaxed mb-8 whitespace-pre-line">
            {event.details}
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-gray-100">
            {isUpcoming ? (
              <a
                href={event.registrationLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto text-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
              >
                Register Now
              </a>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
              >
                Registration Closed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
