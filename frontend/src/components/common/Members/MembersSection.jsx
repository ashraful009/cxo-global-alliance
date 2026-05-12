import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getMembers } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import useFetch from '../../../hooks/useFetch';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import SliderArrow from '../../ui/SliderArrow/SliderArrow';
import SkeletonCard from '../../ui/SkeletonCard/SkeletonCard';

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-emerald-600',
  'bg-orange-600', 'bg-rose-600', 'bg-teal-600',
];
const getAvatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const MembersSection = () => {
  const { data, loading, error } = useFetch(getMembers);
  const members = data || [];
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => setItemsToShow(window.innerWidth < 768 ? 1 : 2);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, members.length - itemsToShow);
  const safeIndex = Math.min(currentIndex, maxIndex);
  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const cardWidthClass = itemsToShow === 1 ? 'w-full' : 'w-[calc(50%-12px)]';
  const translateOffset = `calc(-${safeIndex * (100 / itemsToShow)}% - ${safeIndex * (24 / itemsToShow)}px)`;

  const handleCardClick = (memberId) => {
    if (!user || user.role === 'user') {
      navigate('/login');
      return;
    }
    navigate(`/profile/${memberId}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="h-10 bg-gray-800 animate-pulse rounded w-64 mx-auto mb-3" />
            <div className="h-5 bg-gray-800 animate-pulse rounded w-80 mx-auto mb-5" />
            <div className="flex justify-center">
              <div className="h-1 bg-gray-800 animate-pulse rounded w-14" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => <SkeletonCard key={i} className="h-40" />)}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Honorable Members" subtitle="The leaders shaping our community" />
          <p className="text-center text-red-400 mt-2">Failed to load data. Please try again.</p>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Honorable Members" subtitle="The leaders shaping our community" />
          <p className="text-center text-gray-500 mt-2">No members to display at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          title="Our Honorable Members"
          subtitle="The leaders shaping our community"
        />

        <div className="flex justify-end gap-3 -mt-6 mb-8">
          <SliderArrow direction="left" onClick={prevSlide} disabled={safeIndex === 0} />
          <SliderArrow direction="right" onClick={nextSlide} disabled={safeIndex >= maxIndex} />
        </div>

        <div className="relative overflow-hidden">
          {safeIndex > 0 && (
            <button onClick={prevSlide}
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60
                         backdrop-blur-sm rounded-full text-white focus:outline-none">
              <FiChevronLeft size={20} />
            </button>
          )}
          {safeIndex < maxIndex && (
            <button onClick={nextSlide}
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60
                         backdrop-blur-sm rounded-full text-white focus:outline-none">
              <FiChevronRight size={20} />
            </button>
          )}

          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ transform: `translateX(${translateOffset})` }}
          >
            {members.map((member) => (
              <div
                key={member._id}
                onClick={() => handleCardClick(member._id)}
                className={`flex-none flex gap-5 items-center bg-gray-800 border border-gray-700
                            rounded-xl p-5 transition-all duration-300 cursor-pointer
                            hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-950/30
                            hover:bg-gray-800/80
                            ${cardWidthClass}`}
              >
                {/* Left — avatar */}
                <div className="w-[40%] flex justify-center flex-shrink-0">
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-gray-600"
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
                                  text-white text-3xl font-bold ring-2 ring-gray-600 select-none
                                  ${getAvatarColor(member.name)}`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Right — details */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-0.5 truncate">
                    {member.name}
                  </h3>
                  {member.designation && (
                    <p className="text-blue-400 text-sm font-medium mb-0.5 truncate">{member.designation}</p>
                  )}
                  {member.organizationName && (
                    <p className="text-gray-400 text-sm mb-2 truncate">{member.organizationName}</p>
                  )}
                  {member.bio && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default MembersSection;
